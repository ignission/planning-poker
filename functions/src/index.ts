import * as admin from "firebase-admin";

import {onValueWritten} from "firebase-functions/lib/v2/providers/database";
import {logger} from "firebase-functions";

admin.initializeApp();

exports.handleVote = onValueWritten(
  "/rooms/${roomId}/users",
  (event) => {
    logger.log("Event data: ", event.data);
  }
);
