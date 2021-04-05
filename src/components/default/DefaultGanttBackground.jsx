import Calendar from "@/src/components/calendar/Calendar";
import DefaultLines from "@/src/components/default/DefaultLines";
import DefaultHeader from "@/src/components/default/DefaultHeader";

export default function DefaultGanttBackground() {
  return (
    <>
      <DefaultHeader />
      <Calendar view="Day" isDefault={true} />
      <DefaultLines />
    </>
  );
}
