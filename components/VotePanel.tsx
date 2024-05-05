import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface VotePanelProps {
  selectedPoint: number | null;
  handleVoteClick: (point: number) => void;
  resetSelection: () => void;
}

export const VotePanel: React.FC<VotePanelProps> = ({
  selectedPoint,
  handleVoteClick,
  resetSelection,
}) => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle>Button Panel</CardTitle>
      <CardDescription>Select an action by clicking a button.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <VoteButton
          color="#FF6347"
          point={1}
          selected={selectedPoint}
          onClick={handleVoteClick}
        />
        <VoteButton
          color="#32CD32"
          point={3}
          selected={selectedPoint}
          onClick={handleVoteClick}
        />
        <VoteButton
          color="#FFD700"
          point={5}
          selected={selectedPoint}
          onClick={handleVoteClick}
        />
        <VoteButton
          color="#1E90FF"
          point={8}
          selected={selectedPoint}
          onClick={handleVoteClick}
        />
        <VoteButton
          color="#9400D3"
          point={13}
          selected={selectedPoint}
          onClick={handleVoteClick}
        />
      </div>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button className="bg-gray-300 text-black" onClick={resetSelection}>
        Reset
      </Button>
    </CardFooter>
  </Card>
);

interface VoteButtonProps {
    color: string;
    point: number;
    selected: number | null;
    onClick?: (point: number) => void;
  }
  
  const VoteButton: React.FC<VoteButtonProps> = ({
    color,
    point,
    selected,
    onClick,
  }) => {
    const toggleStyle = () => {
      if (onClick) {
        onClick(point);
      }
    };
  
    const buttonStyle =
      point == selected
        ? `bg-[${color}] text-white border-2 border-[${color}] hover:bg-[${color}]`
        : `border-2 border-[${color}] text-${color} bg-transparent hover:bg-white`;
  
        console.log(buttonStyle);
    return (
      <Button className={buttonStyle} onClick={toggleStyle}>
        {point}
      </Button>
    );
  };