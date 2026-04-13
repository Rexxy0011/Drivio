import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import DateField, { startOfToday } from "../components/DateField";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars,
    axios,
    user,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    currency,
  } = useAppContext();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);

  const today = useMemo(() => startOfToday(), []);
  const minReturnDate = useMemo(() => {
    if (!pickupDate) return today;
    const d = new Date(pickupDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [pickupDate, today]);

  const numberOfDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    return Math.max(
      0,
      dayjs(returnDate).startOf("day").diff(dayjs(pickupDate).startOf("day"), "day")
    );
  }, [pickupDate, returnDate]);

  const totalPrice = car ? car.pricePerDay * numberOfDays : 0;
  const canBook = pickupDate && returnDate && numberOfDays > 0 && !submitting;

  const flwConfig = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: pendingPayment?.reference ?? "",
    amount: pendingPayment?.amount ?? 0,
    currency: "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: user?.email ?? "",
      name: user?.name ?? "",
    },
    customizations: {
      title: "Drivio",
      description: car ? `${car.brand} ${car.model} rental` : "Car rental",
      logo: "",
    },
  };

  const handleFlutterPayment = useFlutterwave(flwConfig);

  const verifyOnServer = async (transactionId, reference) => {
    try {
      const { data } = await axios.post("/api/payments/verify", {
        transactionId,
        reference,
      });
      if (data.success) {
        toast.success("Booking confirmed");
        navigate("/my-bookings");
      } else {
        toast("Payment received — confirmation pending");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!pendingPayment) return;
    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal();
        if (response.status === "successful" || response.status === "completed") {
          verifyOnServer(response.transaction_id, response.tx_ref);
        } else {
          toast.error("Payment not completed");
        }
        setPendingPayment(null);
      },
      onClose: () => {
        toast("Payment cancelled — your hold expires in 15 minutes");
        setPendingPayment(null);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPayment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canBook) return;
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setPendingPayment(data.booking);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePickupChange = (next) => {
    setPickupDate(next);
    if (returnDate && dayjs(returnDate).isBefore(dayjs(next).add(1, "day"))) {
      setReturnDate("");
    }
  };

  useEffect(() => {
    setCar(cars.find((car) => car._id === id));
  }, [cars, id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* left:car image & details */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </div>
              ))}
            </div>
            {/* description */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>
            {/* features */}
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "30 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking Form  */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-2xl p-6 space-y-6 text-gray-500 bg-white border border-borderColor/60"
        >
          <p className="flex items-baseline justify-between text-3xl text-gray-800 font-semibold">
            <span>
              {currency}
              {car.pricePerDay.toLocaleString()}
            </span>
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>
          <hr className="border-borderColor" />

          <DateField
            label="Pickup date"
            value={pickupDate}
            onChange={handlePickupChange}
            minDate={today}
            placeholder="Select pickup"
          />

          <DateField
            label="Return date"
            value={returnDate}
            onChange={setReturnDate}
            minDate={minReturnDate}
            placeholder="Select return"
          />

          {numberOfDays > 0 && (
            <div className="rounded-xl bg-light p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {currency}
                  {car.pricePerDay.toLocaleString()} × {numberOfDays}{" "}
                  {numberOfDays === 1 ? "day" : "days"}
                </span>
                <span className="text-gray-700">
                  {currency}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              <hr className="border-borderColor/60" />
              <div className="flex justify-between text-base font-semibold text-gray-800">
                <span>Total</span>
                <span>
                  {currency}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canBook}
            className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {submitting ? "Booking..." : "Book Now"}
          </button>
          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};
export default CarDetails;
