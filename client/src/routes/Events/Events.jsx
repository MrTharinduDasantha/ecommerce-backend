import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getEvents } from "../../api/event";

const EventSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        if (data.message === "Events fetched successfully") {
          // Filter only active events
          const activeEvents = data.events.filter(
            (event) => event.Status === "active"
          );
          setEvents(activeEvents);
          setFilteredEvents(activeEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.Event_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.Event_Description.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  // Handle see offers button click
  const handleSeeOffers = (event) => {
    navigate(`/event-products/${event.idEvent}`, {
      state: {
        eventId: event.idEvent,
        eventName: event.Event_Name,
        eventDescription: event.Event_Description,
        eventImage: event.Event_Image_Url,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CAF90]"></div>
            <p className="mt-4 text-[#1D372E]">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[39.81px] font-semibold text-[#2D2D2D] mb-6 text-center">
        <span className="text-[#1D372E]">Events at </span>
        <span className="text-[#5CAF90]">Asipiya</span>
      </h2>

      {/* Search bar */}
      <div className="flex justify-center mb-6 ml-55">
        <div className="flex flex-1 max-w-full sm:max-w-2xl px-4">
          <input
            type="text"
            placeholder="SEARCH EVENTS"
            className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins border border-[#E8E8E8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-[#5CAF90] p-2 w-9 rounded-r-md">
            <FaSearch className="text-[#FFFFFF]" />
          </button>
        </div>
      </div>

      {/* Events Grid or No Events Message */}
      {filteredEvents.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <p className="text-[#1D372E] text-xl font-semibold mb-2">
              No events found
            </p>
            <p className="text-[#7A7A7A] text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No events are currently available"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.idEvent}
              className="bg-white rounded-lg relative border border-[#E8E8E8] hover:shadow-lg transition-shadow cursor-pointer hover:scale-[1.02] transform duration-300"
              style={{ width: "250px", height: "300px" }}
            >
              <div className="relative">
                <img
                  src={event.Event_Image_Url}
                  alt={event.Event_Name}
                  className="w-[250px] h-[190px] object-cover rounded-t-lg"
                />
              </div>
              <div className="mt-4 px-2">
                <h3 className="text-[16px] font-semibold text-center text-[#1D372E] line-clamp-1 mb-2">
                  {event.Event_Name}
                </h3>
                {/* See Offers Button */}
                <button
                  onClick={() => handleSeeOffers(event)}
                  className="mt-2 w-[150px] py-2 bg-[#5CAF90] text-center mx-auto block text-[#FFFFFF] rounded-[30px] font-semibold text-[14px] hover:bg-[#4a9f7a] transition-colors"
                >
                  See Offers
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSection;
