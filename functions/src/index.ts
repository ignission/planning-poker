import * as admin from "firebase-admin";
import * as database from "firebase-functions/v2/database";

import {logger} from "firebase-functions";

admin.initializeApp();

export const handleVote = database.onValueWritten(
  "/rooms/{roomId}/users",
  (event) => {
    const roomId = event.params.roomId;

    logger.log("root id: " + roomId);

    if (!event.data.after.exists()) {
      logger.log("Data after is null");
      return;
    }

    const original = event.data.after.val();
    const list = Object.values(original);

    if (list.length <= 1) {
      logger.log("Not enough users to handle vote");
      logger.log("List length: " + list.length);
      return;
    }

    const voted = list.every((user: any) => user.point !== null && user.point !== undefined);
    if (!voted) {
      logger.log("Not all users have voted");
      logger.log("List: " + JSON.stringify(list));
      return;
    }
  }
);
