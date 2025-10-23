const { createUserSchema, loginUserSchema, updateUserSchema } = require('../validations/user.validation');

describe("User Validation Tests", () => {

  // Test creating a user
  it("should validate a correct createUser payload", () => {
    const validPayload = {
      name: "Rony",
      email: "rony@example.com",
      password: "123456",
      role: "user"
    };
    const { error } = createUserSchema.validate(validPayload);
    expect(error).toBeUndefined();
  });

  it("should fail if email is invalid", () => {
    const invalidPayload = {
      name: "Rony",
      email: "invalidemail",
      password: "123456",
      role: "user"
    };
    const { error } = createUserSchema.validate(invalidPayload);
    expect(error).toBeDefined();
  });

  // Test login validation
  it("should validate a correct login payload", () => {
    const payload = { email: "test@example.com", password: "123456" };
    const { error } = loginUserSchema.validate(payload);
    expect(error).toBeUndefined();
  });

  it("should fail login if password missing", () => {
    const payload = { email: "test@example.com" };
    const { error } = loginUserSchema.validate(payload);
    expect(error).toBeDefined();
  });

  // Test update validation
  it("should validate a correct update payload", () => {
    const payload = { name: "New Name" };
    const { error } = updateUserSchema.validate(payload);
    expect(error).toBeUndefined();
  });

  it("should fail update if payload is empty", () => {
    const payload = {};
    const { error } = updateUserSchema.validate(payload);
    expect(error).toBeDefined();
  });

});
