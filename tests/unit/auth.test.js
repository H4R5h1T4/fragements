describe('auth middleware (test mode)', () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  beforeEach(() => {
    jest.resetModules();
  });

  function makeRes() {
    return {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      endCalled: false,
      end() {
        this.endCalled = true;
        return this;
      },
    };
  }

  test('returns 401 when Authorization header is missing', () => {
    const auth = require('../../src/auth/cognito');
    const mw = auth();

    const req = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    mw(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when Authorization is not Basic', () => {
    const auth = require('../../src/auth/cognito');
    const mw = auth();

    const req = { headers: { authorization: 'Bearer abc.def.ghi' } };
    const res = makeRes();
    const next = jest.fn();

    mw(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for wrong Basic credentials', () => {
    const auth = require('../../src/auth/cognito');
    const mw = auth();

    const bad = Buffer.from('nope@example.com:wrong').toString('base64');
    const req = { headers: { authorization: `Basic ${bad}` } };
    const res = makeRes();
    const next = jest.fn();

    mw(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.endCalled).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() and sets req.user for valid Basic credentials', () => {
    const auth = require('../../src/auth/cognito');
    const mw = auth();

    const good = Buffer.from('test-user1@fragments-testing.com:test-password1').toString('base64');
    const req = { headers: { authorization: `Basic ${good}` } };
    const res = makeRes();
    const next = jest.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ email: 'test-user1@fragments-testing.com' });
    expect(res.endCalled).toBe(false);
  });
});
