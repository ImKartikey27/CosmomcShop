import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
  inviter: {
    id: String,
    username: String,
    tag: String
  },
  code: String,
  uses: Number,
  joinedUsers: [
    {
      username: String,
      userId: String,
      joinedAt: Date
    }
  ]
});

export default mongoose.models.Invite || mongoose.model("Invite", InviteSchema);
