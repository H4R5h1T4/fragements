const hash = require('../../src/hash');

describe('auth middleware (test mode)', () => {
  test('returns 401 when Authorization header is missing', async () => {
    const middleware = require('../../src/auth/cognito')();
    const req = { headers: {} };

    const res = {
      statusCode: null,
      endCalled: false,
      status(code) {
        this.statusCode = code;
        return this;
      },
      end() {
        this.endCalled = true;
      },
    };

    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when Authorization is not Basic', async () => {
    const middleware = require('../../src/auth/cognito')();
    const req = { headers: { authorization: 'Bearer abc' } };

    const res = {
      statusCode: null,
      endCalled: false,
      status(code) {
        this.statusCode = code;
        return this;
      },
      end() {
        this.endCalled = true;
      },
    };

    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for wrong Basic credentials', async () => {
    const middleware = require('../../src/auth/cognito')();
    const bad = Buffer.from('nope:nope').toString('base64');
    const req = { headers: { authorization: `Basic ${bad}` } };

    const res = {
      statusCode: null,
      endCalled: false,
      status(code) {
        this.statusCode = code;
        return this;
      },
      end() {
        this.endCalled = true;
      },
    };

    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() and sets req.user for valid Basic credentials', async () => {
    const middleware = require('../../src/auth/cognito')();
    const good = Buffer.from('test-user1@fragments-testing.com:test-password1').toString('base64');
    const req = { headers: { authorization: `Basic ${good}` } };

    const res = {
      statusCode: null,
      endCalled: false,
      status(code) {
        this.statusCode = code;
        return this;
      },
      end() {
        this.endCalled = true;
      },
    };

    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(req.user).toEqual(hash('test-user1@fragments-testing.com'));

    expect(res.endCalled).toBe(false);
  });
});
