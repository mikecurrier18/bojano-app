'use client'

import React from 'react'
import data from '@/constants/sample/data.json'
import { convertStringToDate, convertStringToNumber } from '@/lib/utils'
import { useState } from 'react'

const setData = (data: any) => {
    data.data.forEach((trip: any) => {
        trip.payOutDate = convertStringToDate(trip.payOutDate)
        trip.checkIn = convertStringToDate(trip.checkIn)
        trip.checkOut = convertStringToDate(trip.checkOut)
        trip.revenue = convertStringToNumber(trip.revenue)
        trip.fee = convertStringToNumber(trip.fee)
        trip.netProfit = convertStringToNumber(trip.netProfit)
    })
    console.log(data)
    return data
}

const DataSummaries = (
    
) => {
  return (
    <div>
        <button onClick={() => setData(data)}>Click me</button>
    </div>
  )
}

export default DataSummaries