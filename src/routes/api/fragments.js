// src/routes/api/fragments.js
const express = require('express');
const { createHash } = require('crypto');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

const router = express.Router();

const rawBody = express.raw({
  type: '*/*',
  limit: '10mb',
});

function hashEmail(email) {
  return createHash('sha256').update(email).digest('hex');
}

function getEmailFromBasicAuth(req) {
  const header = req.get('authorization');
  if (!header || !header.toLowerCase().startsWith('basic ')) return null;

  const b64 = header.split(' ')[1];
  if (!b64) return null;

  const decoded = Buffer.from(b64, 'base64').toString('utf8');
  const email = decoded.split(':')[0];

  return email || null;
}

function getOwnerId(req) {
  if (req.user && typeof req.user.email === 'string') {
    return hashEmail(req.user.email);
  }

  if (req.user && req.user.claims && typeof req.user.claims.email === 'string') {
    return hashEmail(req.user.claims.email);
  }

  if (typeof req.user === 'string') {
    return req.user;
  }

  const email = getEmailFromBasicAuth(req);
  if (email) {
    return hashEmail(email);
  }

  throw new Error('missing authenticated user');
}

function fragmentMeta(fragment) {
  return {
    id: fragment.id,
    ownerId: fragment.ownerId,
    created: fragment.created,
    updated: fragment.updated,
    type: fragment.type,
    size: fragment.size,
  };
}

router.post('/fragments', rawBody, async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);

    const header = req.get('content-type');

    if (!header || header.startsWith('application/x-www-form-urlencoded')) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'Content-Type header required' },
      });
    }

    if (!Fragment.isSupportedType(header)) {
      return res.status(415).json({
        status: 'error',
        error: { code: 415, message: 'unsupported Content-Type' },
      });
    }

    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'fragment data required' },
      });
    }

    const parsed = contentType.parse(header);
    const normalizedType = parsed.parameters.charset
      ? `${parsed.type}; charset=${parsed.parameters.charset}`
      : parsed.type;

    const fragment = new Fragment({
      ownerId,
      type: normalizedType,
      size: 0,
    });

    await fragment.save();
    await fragment.setData(req.body);

    res.set('Location', `${req.protocol}://${req.get('host')}/v1/fragments/${fragment.id}`);
    return res.status(201).json({
      status: 'ok',
      fragment: fragmentMeta(fragment),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/fragments', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);
    const expand = req.query.expand === '1';

    const fragments = await Fragment.byUser(ownerId, expand);

    return res.status(200).json({
      status: 'ok',
      fragments,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/fragments/:id/info', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);
    const fragment = await Fragment.byId(ownerId, req.params.id);

    return res.status(200).json({
      status: 'ok',
      fragment: fragmentMeta(fragment),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/fragments/:id', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);
    const fragment = await Fragment.byId(ownerId, req.params.id);
    const data = await fragment.getData();

    res.set('Content-Type', fragment.type);
    return res.status(200).send(data);
  } catch (err) {
    next(err);
  }
});

router.put('/fragments/:id', rawBody, async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);

    const header = req.get('content-type');

    if (!header || header.startsWith('application/x-www-form-urlencoded')) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'Content-Type header required' },
      });
    }

    const fragment = await Fragment.byId(ownerId, req.params.id);

    const incomingMime = contentType.parse(header).type;
    const existingMime = fragment.mimeType;

    if (incomingMime !== existingMime) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'Content-Type does not match existing fragment type' },
      });
    }

    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'fragment data required' },
      });
    }

    await fragment.setData(req.body);

    return res.status(200).json({
      status: 'ok',
      fragment: fragmentMeta(fragment),
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/fragments/:id', async (req, res, next) => {
  try {
    const ownerId = getOwnerId(req);
    await Fragment.delete(ownerId, req.params.id);

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
