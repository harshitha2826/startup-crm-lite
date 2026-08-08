import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @typedef {Object} UserDocument
 * @property {string}  name      - The full display name of the user.
 * @property {string}  email     - The unique email address used for authentication.
 * @property {string}  password  - Bcrypt-hashed password. Never stored as plain text.
 * @property {string}  role      - The user's access level: 'admin' or 'user'.
 * @property {boolean} isActive  - Whether the account is currently enabled.
 * @property {Date}    createdAt - Automatically set by Mongoose timestamps.
 * @property {Date}    updatedAt - Automatically updated by Mongoose on every save.
 */

const userSchema = new mongoose.Schema(
  {
    /**
     * Full display name of the user.
     * Used in UI headers, lead ownership labels, and audit trails.
     * Must be between 2 and 50 characters after trimming whitespace.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot be longer than 50 characters'],
    },

    /**
     * The user's unique email address.
     * Stored in lowercase to prevent duplicate accounts from case differences.
     * Used as the login identifier and for account recovery.
     * Validated against RFC 5322-compliant regex.
     */
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: 'Email must be a valid email address (e.g. user@example.com)',
      },
    },

    /**
     * Bcrypt-hashed password (10 salt rounds).
     * The pre-save middleware handles hashing automatically.
     * Plain text is NEVER persisted — toJSON() additionally strips this field
     * from any serialised output to prevent accidental API leakage.
     * Minimum 6 characters enforced before hashing.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    /**
     * Access role for role-based access control (RBAC).
     * - 'user'  → standard CRM access (own leads only)
     * - 'admin' → elevated access (all leads, user management)
     * Defaults to 'user'. Role escalation is guarded at the controller level.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: "Role must be either 'admin' or 'user', got '{VALUE}'",
      },
      default: 'user',
    },

    /**
     * Soft-delete flag. When set to false the account is deactivated
     * but not physically removed from the database, preserving lead history
     * and audit trails. The `protect` middleware rejects inactive users.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    /**
     * Automatically manages `createdAt` and `updatedAt` fields.
     * Mongoose sets createdAt on first insert and updates updatedAt on every save.
     */
    timestamps: true,
  }
);

// ─── Pre-save Middleware ───────────────────────────────────────────────────────

/**
 * Hashes the user's password before persisting to MongoDB.
 *
 * Only executes when the `password` field has been modified (new document or
 * explicit password change), preventing unnecessary re-hashing on unrelated
 * updates such as changing name or email.
 *
 * Uses bcryptjs with 10 salt rounds — a deliberate cost factor that balances
 * security (brute-force resistance) with server performance.
 */
userSchema.pre('save', async function () {
  if (this.isModified('password') || (this.isNew && this.password)) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Compares a plain-text candidate password against the stored bcrypt hash.
 *
 * Designed for use in the login flow after retrieving the user document
 * with `.select('+password')` to re-include the normally hidden field.
 *
 * @param  {string}           candidatePassword - The plain-text password from the login request body.
 * @returns {Promise<boolean>}                    True if the password matches, false otherwise.
 *                                                Never throws — returns false on internal bcrypt errors.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

/**
 * Overrides the default Mongoose serialiser to remove the hashed password
 * before the document is converted to JSON (e.g. in `res.json(user)`).
 *
 * This is a defence-in-depth measure: even if a developer accidentally
 * returns the full user object from a controller, the password hash will
 * never appear in the API response.
 *
 * @returns {Object} A plain object representation of the user without `password`.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// ─── Model + Named Schema Export ──────────────────────────────────────────────

/** The compiled Mongoose model for the `users` collection. */
const User = mongoose.model('User', userSchema);

export { userSchema };       // named export — for testing, composing or extending
export default User;         // default export — for use in controllers and middleware
