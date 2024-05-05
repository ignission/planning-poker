import * as admin from "firebase-admin";
import * as database from "firebase-functions/v2/database";

import {logger} from "firebase-functions";

admin.initializeApp();

export const handleVote = database.onValueWritten(
  "/rooms/{roomId}",
  (event) => {
    if (!event.data.after.exists()) {
      logger.log("Data after is null");
      return;
    }

    const roomData = event.data.after.val();
    const userData = roomData.users;
    const users = Object.values(userData);

    if (users.length <= 1) {
      logger.log("Not enough users to handle vote");
      logger.log("User length: " + users.length);
      return;
    }

    const voted = users.every(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user: any) => user.point !== null && user.point !== undefined
    );
    if (!voted) {
      logger.log("Not all users have voted");
      logger.log("Users: " + JSON.stringify(users));
      return;
    }

    return event.data.after.ref.update({finished: true});
  }
);
