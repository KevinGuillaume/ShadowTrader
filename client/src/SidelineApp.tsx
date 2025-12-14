import { useEffect, useState } from "react";
import { backendAPI } from "./api";

export default function SidelineApp() {
    const [data,setData] = useState(null)  

    async function init(){
        const values = await backendAPI.getEventsData("nfl")
        setData(values)
    }

    useEffect(() => {
        init()
    },[])


    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">Welcome to Sideline Trader</h1>
          <p className="text-2xl text-gray-300">{data}</p>
        </div>
      </div>
    );
  }