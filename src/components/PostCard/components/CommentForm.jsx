import {useForm} from 'react-hook-form'
import z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const CommentForm = ({onSubmit}) => {
  const schema = z.object({
    comment: z
      .string()
      .max(30, 'Length must be less than or equal to 30 characters long')
  })

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    defaultValues: {
      comment: ''
    },
    resolver: zodResolver(schema)
  })

  const onSubmitHandler = (data) => {
    onSubmit(data)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="mt-3 flex flex-col"
    >
      <div className="flex items-center w-full">
        <input
          type="text"
          {...register('comment')}
          placeholder="Write a comment..."
          className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        <button
          type="submit"
          className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Post
        </button>
      </div>
      {errors.comment && (
        <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
      )}
    </form>
  )
}

export default CommentForm
