function BookListItem({BookName="Unknown Bookname", BookDesc="No description", BookCover="https://placehold.co/300", children}) {
    return(
        <div className="flex flex-col justify-between bg-gray shadow-md rounded-xl overflow-hidden w-72 pt-4 px-0">
            <img src={BookCover} alt="book cover" className="h-[150px] px-4 mb-4 rounded-t-xl object-cover"/>
            <div className="px-2 mb-4">
                <h1 className="text-2xl font-bold mb-2">{BookName}</h1>
                <p className="text-base">{BookDesc}</p>
            </div>
            {children}
            <a href="#" className="text-lg text-center py-2 font-bold border-t-2 border-gray-dark">Join</a>
        </div>
    )
}
export default BookListItem ;