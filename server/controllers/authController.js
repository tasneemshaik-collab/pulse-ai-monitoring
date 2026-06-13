const User =
  require(
    "../models/user"
  );

const bcrypt =
  require(
    "bcryptjs"
  );

const jwt =
  require(
    "jsonwebtoken"
  );

const generateToken =
  (id) => {
    return jwt.sign(
      { id },
      process.env
        .JWT_SECRET,
      {
        expiresIn:
          "7d",
      }
    );
  };

// REGISTER
const registerUser =
  async (
    req,
    res
  ) => {
    try {
      const {
        name,
        email,
        phone,
        password,
      } = req.body;

      const userExists =
        await User.findOne(
          {
            email,
          }
        );

      if (
        userExists
      ) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      const salt =
        await bcrypt.genSalt(
          10
        );

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      const user =
        await User.create(
          {
            name,
            email,
            phone,
            password:
              hashedPassword,
          }
        );

      res
        .status(201)
        .json({
          _id:
            user._id,
          name:
            user.name,
          email:
            user.email,
          phone:
            user.phone,
          token:
            generateToken(
              user._id
            ),
        });
    } catch (
      error
    ) {
      res.status(
        500
      ).json({
        message:
          error.message,
      });
    }
  };

// LOGIN
const loginUser =
  async (
    req,
    res
  ) => {
    try {
      const {
        email,
        password,
        phone,
      } = req.body;

      const user =
        await User.findOne(
          {
            email,
          }
        );

      if (
        user &&
        (await bcrypt.compare(
          password,
          user.password
        ))
      ) {

        // Save phone if missing
        if (
          !user.phone &&
          phone
        ) {
          user.phone =
            phone;

          await user.save();
        }

        return res.json(
          {
            _id:
              user._id,
            name:
              user.name,
            email:
              user.email,
            phone:
              user.phone,
            token:
              generateToken(
                user._id
              ),
          }
        );
      }

      res.status(
        401
      ).json({
        message:
          "Invalid credentials",
      });
    } catch (
      error
    ) {
      res.status(
        500
      ).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  registerUser,
  loginUser,
};