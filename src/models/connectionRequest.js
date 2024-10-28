const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",        // Reference to the User collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps: true,
});
 
// Compound index to make DB queries Fast
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    // Check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can not Send Connection Request to yourself!");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "connectionRequest", connectionRequestSchema
);

module.exports = ConnectionRequestModel;