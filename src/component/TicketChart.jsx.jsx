import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const TicketChart = () => {

  const data = [
    { day: "Mon", newTickets: 33, resolved: 30 },
    { day: "Tue", newTickets: 33, resolved: 32 },
    { day: "Wed", newTickets: 38, resolved: 42 },
    { day: "Thu", newTickets: 32, resolved: 35 },
    { day: "Fri", newTickets: 33, resolved: 34 },
    { day: "Sat", newTickets: 24, resolved: 20 },
    { day: "Sun", newTickets: 18, resolved: 15 },
  ];

  return (
    <div style={{ width: "100%", height: 400, padding: "10px" }}>
      <h4 style={{ textAlign: "center", padding: "10px" }}>Ticket Volume & Resolution</h4>

      <ResponsiveContainer>
        <BarChart data={data}>
          
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip />
          <Legend />

          {/* Purple Bar */}
          <Bar
            dataKey="newTickets"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
          />

          {/* Green Line */}
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#10b981"
            strokeWidth={3}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default TicketChart;