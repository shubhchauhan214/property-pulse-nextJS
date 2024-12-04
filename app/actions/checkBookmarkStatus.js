'use server';
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

async function checkBookmarkStatus(propertyId){
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId){
        throw new Error('User ID is required');
    }

    const {userId} = sessionUser; // WE GET USER ID FROM SESSION USER.

    // we get user id from session user and that particular(whose userid we are using) and the user from the database.
    const user = await User.findById(userId);

    // we get the user from the database. now we check to see if the user is bookmarked or not.
    let isBookmarked = user.bookmarks.includes(propertyId);

    return {isBookmarked};
}

export default checkBookmarkStatus;