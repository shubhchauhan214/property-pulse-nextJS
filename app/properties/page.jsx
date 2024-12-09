import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import Property from '@/models/Property';

const PropertiesPage = async ({ searchParams }) => {
    const page = parseInt(searchParams?.page || '1', 10); // Default to page 1
    const pageSize = parseInt(searchParams?.pageSize || '2', 10); // Default to pageSize 2

    try {
        await connectDB();
        const skip = (page - 1) * pageSize;
        const total = await Property.countDocuments({});
        const properties = await Property.find({}).skip(skip).limit(pageSize).lean();

        const totalPages = Math.ceil(total / pageSize); // Calculate total pages

        return (
            <section className="px-4 py-6">
                <div className="container-xl lg:container m-auto px-4 py-6">
                    {properties.length === 0 ? (
                        <p>No properties found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                    <Pagination currentPage={page} totalPages={totalPages} />
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error fetching properties:', error);
        return (
            <section className="px-4 py-6">
                <div className="container-xl lg:container m-auto px-4 py-6">
                    <p>Error fetching properties. Please try again later.</p>
                </div>
            </section>
        );
    }
};

export default PropertiesPage;
