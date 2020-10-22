const { expect } = require("chai");
const sinon = require("sinon");
const usersController = require("../src/controllers/User");
const { User } = require("../models");

describe("Controllers :: UsersController :: Integration", () => {
  describe("#addUser", () => {
    it("should execute create method", async () => {
      // Given
      const data = {
        firstName: "Sylvie",
        lastName: "Lu",
        email: "sylu@jade.fr",
        password: "azerty1",
        birthday: "2001-05-30",
        role: "Acheteur",
      };

      const createStub = sinon.stub(User, "create");

      // When
      await usersController.signUp(data);

      // Then
      expect(createStub.calledOnce).to.be.true;
    });
  });
});
