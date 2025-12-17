import { useEffect, useState } from "react";
import { backendAPI } from "./api";

export default function SidelineApp() {
    const [data,setData] = useState<any>([])  

    async function init(){
        const values = await backendAPI.getEventsData("NFL")
        setData(values["events"])
    }

    useEffect(() => {
        init()
    },[])


    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">Welcome to Sideline Trader</h1>
          <div>
            <p>All Questions:</p>
            {data.map((e: any) => <p>{e.title}</p>)}
          </div>
        </div>
      </div>
    );
  }