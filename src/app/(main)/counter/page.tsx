import { Counter } from "./counter";

// @Tutor: A way to tackle this issue is to put your client-side code in a seperate file
// and import that component

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Counter",
  description: "This is the Counter Section of the Website",
};


export default function CounterPage(){
    return <Counter/>
}