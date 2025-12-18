import API from "../api/axios";

const RSVP = ({ eventId, refresh }) => {
  const joinEvent = async () => {
    try {
      await API.post(`/events/${eventId}/rsvp`);
      refresh();
    } catch (error) {
      alert(error.response?.data?.message || "RSVP failed");
    }
  };

  const leaveEvent = async () => {
    try {
      await API.delete(`/events/${eventId}/rsvp`);
      refresh();
    } catch (error) {
      alert("Failed to cancel RSVP");
    }
  };

  return (
    <div className="d-flex justify-center gap-2">
      <button onClick={joinEvent} className="btn btn-success flex-grow-1">Join Event</button>
      <button onClick={leaveEvent} className="btn btn-danger flex-grow-1">Leave Event</button>
    </div>
  );
};

export default RSVP;
