 'use server';
 import connectDB from "@/config/database";
 import User from "@/models/User";
 import { getSessionUser } from "@/utils/getSessionUser";
 import { revalidatePath } from "next/cache";

 async function bookmarkProperty(propertyId) {
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

    let message;

    if (isBookmarked){
        // If already bookmarked, then remove
        user.bookmarks.pull(propertyId); // pull method is to used to remove
        message = 'Bookmark Removed';
        isBookmarked = false;  // iska mtlb ki ye ab bookmark ni h
    }else{
        // if not bookmarked, then add
        user.bookmarks.push(propertyId); // push method is used to add
        message = 'Bookmark Added';
        isBookmarked = true;
    }

    await user.save();
    revalidatePath('/properties/saved', 'page');

    return {
        message,
        isBookmarked,
    };
 };

 export default bookmarkProperty;