export default function NextRaceCard({ race }: { race: any }) {
  if (!race) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-gray-500">
        No upcoming races.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-blue-600">Next Race</h2>
      <p className="mt-2 text-gray-800 text-lg">{race.name}</p>
      <p className="text-gray-600">{new Date(race.start).toLocaleString()}</p>
    </div>
  );
}
