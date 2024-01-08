import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateRoom() {
  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ルームを作成する</CardTitle>
          <CardDescription>新しくルームを作成します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">ルーム名</Label>
            <Input id="room-name" required type="text" className="focus:border-blue-500 focus-visible:ring-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-name">あなたの名前</Label>
            <Input id="room-name" required type="text" className="focus:border-blue-500 focus-visible:ring-0" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500">
            作成する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
