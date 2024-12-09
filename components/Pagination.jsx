const Pagination = ({ currentPage, totalPages }) => {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <section className="container mx-auto flex justify-center items-center my-8">
            {prevPage && (
                <a href={`?page=${prevPage}`} className="mr-2 px-2 py-1 border border-gray-300 rounded">
                    Previous
                </a>
            )}
            <span className="mx-2">Page {currentPage} of {totalPages}</span>
            {nextPage && (
                <a href={`?page=${nextPage}`} className="ml-2 px-2 py-1 border border-gray-300 rounded">
                    Next
                </a>
            )}
        </section>
    );
};

export default Pagination;
