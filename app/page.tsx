import { Button } from "@/components/ui/button";
// import {db} from "../lib/db"

export default async function Home() {

  // await db.set('hello','fello');

  return (
    <>
      <h1>Hello World</h1>
      <Button variant="destructive">Press me!</Button>
    </>
  );
}
