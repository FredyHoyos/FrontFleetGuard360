"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Graficar() {

    const data = [
        { name: 'Inasistencias', value: 30 },
        { name: 'Asistencias', value: 30 },
        { name: 'Adicionales', value: 30 },
        
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}
