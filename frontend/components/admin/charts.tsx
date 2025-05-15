"use client"

import React from "react"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart as RechartsAreaChart,
} from "recharts"

interface ChartProps {
  data: any[]
  height?: number
  valueFormatter?: (value: number) => string
}

export function AreaChart({ data, height = 300, valueFormatter = (value: number) => `${value}` }: ChartProps) {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ height }}></div>
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <Tooltip
          formatter={valueFormatter}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E2E8F0",
            color: "#0F172A",
          }}
        />
        <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export function BarChart({ data, height = 300, valueFormatter = (value: number) => `${value}` }: ChartProps) {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ height }}></div>
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <Tooltip
          formatter={valueFormatter}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E2E8F0",
            color: "#0F172A",
          }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsAreaChart() {
  const chartTheme = {
    axis: {
      domain: {
        line: {
          stroke: "#CBD5E1",
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: "#CBD5E1",
          strokeWidth: 1
        },
        text: {
          fill: "#64748B"
        }
      },
      legend: {
        text: {
          fill: "#64748B"
        }
      }
    },
    grid: {
      line: {
        stroke: "#E2E8F0",
        strokeWidth: 1
      }
    },
    legends: {
      text: {
        fill: "#64748B"
      }
    },
    tooltip: {
      container: {
        background: "#FFFFFF",
        color: "#0F172A",
        fontSize: 12,
        borderRadius: 4,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  }
}

export function RevenueChart() {
  const chartTheme = {
    axis: {
      domain: {
        line: {
          stroke: "#CBD5E1",
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: "#CBD5E1",
          strokeWidth: 1
        },
        text: {
          fill: "#64748B"
        }
      },
      legend: {
        text: {
          fill: "#64748B"
        }
      }
    },
    grid: {
      line: {
        stroke: "#E2E8F0",
        strokeWidth: 1
      }
    },
    legends: {
      text: {
        fill: "#64748B"
      }
    },
    tooltip: {
      container: {
        background: "#FFFFFF",
        color: "#0F172A",
        fontSize: 12,
        borderRadius: 4,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  }
}

