const { expect } = require("chai");
const User = require("../src/controllers/User");

describe("user", () => {
  it("register::empty firstname", async () => {
    var data = {
      firstName: "yoram",
      lastName: "taieb",
      email: "yoram@gmail.com",
      password: "yoram200",
      city: "Paris",
      description: "Hellooo",
      birthday: "30/01/2001",
      role: "acheteur",
    };
    let registerUser = await User.signUp(data);
    expect(registerUser).to.eql({
      succes: false,
      succesMessage: null,
      errors: ["le champs firstName est obligatoire"],
      status: 401,
    });
  });
});
