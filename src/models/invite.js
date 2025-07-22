import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
  inviter: {
    id: String,
    username: String,
    tag: String
  },
  code: String,
  uses: Number,
  invites: Number,
  joinedUsers: [
    {
      username: String,
      userId: String,
      joinedAt: Date
    }
  ]
});


const Invite =  mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

export default Invite
