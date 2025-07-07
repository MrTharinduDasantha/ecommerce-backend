import StarIcon from "@mui/icons-material/Star"

const ReviewCard = ({ review, customer,initials }) => {
  return (
    <div className="flex gap-2 shadow-lg p-4 rounded-lg bg-gray-50 h-fit">
      <div className="bg-green-400 rounded-full p-3 size-10 flex items-center justify-center">
        <span className="text-white font-bold">{initials}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{customer}</span>
        <div>
          {[...Array(parseInt(review.rating))].map((_, index) => (
            <StarIcon key={index} className="text-yellow-400" />
          ))}
        </div>
        <p className="text-sm/relaxed">{review.comment}</p>
      </div>
    </div>
  )
}
export default ReviewCard
