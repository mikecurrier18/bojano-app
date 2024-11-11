"use client";

import React from "react";

// TODO: Swap this out for a backend API call.
import data from "@/constants/sample/data.json";

import { convertStringToDate, convertStringToNumber } from "@lib/utils";

const setData = (data1: any) => {
    data1.data.forEach((trip: any) => {
        trip.payOutDate = convertStringToDate(trip.payOutDate);
        trip.checkIn = convertStringToDate(trip.checkIn);
        trip.checkOut = convertStringToDate(trip.checkOut);
        trip.revenue = convertStringToNumber(trip.revenue);
        trip.fee = convertStringToNumber(trip.fee);
        trip.netProfit = convertStringToNumber(trip.netProfit);
    });
    console.log(data);
    return data;
};

export default function DataSummaries() {
    return (
        <div>
            <button onClick={() => setData(data)}>Click me</button>
        </div>
    );
}
