import * as admin from "firebase-admin";
import * as database from "firebase-functions/v2/database";

import {logger} from "firebase-functions";

admin.initializeApp();

export const handleVote = database.onValueWritten(
  "/rooms/{roomId}/users",
  (event) => {
    logger.log("Event data: ", event.data);
    logger.log("Event params: ", event.params);
  }
);
