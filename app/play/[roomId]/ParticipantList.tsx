import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Participant } from "@/lib/model/participant";

interface ParticipantsListProps {
  participants: Participant[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle>Participants</CardTitle>
      <CardDescription>View the list of participants.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4">
        {participants.map((p, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded flex items-center">
            <span className="ml-2">{p.name}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);