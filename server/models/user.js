const mongoose =
  require(
    "mongoose"
  );

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

// Force index creation
userSchema.index(
  { email: 1 },
  { unique: true }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    sparse: true,
  }
);

module.exports =
  mongoose.models
    .User ||
  mongoose.model(
    "User",
    userSchema
  );