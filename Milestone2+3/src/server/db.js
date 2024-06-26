import PouchDB from 'pouchdb';
import { User } from '../client/utils/user.js';

// create sample data for ease of testing
const dbUser = new PouchDB('userServer');
const propUser1 = new User('0', "ktle@umass.edu", "ilovecs326", "Khiem", 3, "Male", ["../figures/cat_pic/cat1.jpg", "../figures/cat_pic/cat2.jpg", "../figures/cat_pic/cat3.jpg"], "Meo Lon")
const propUser2 = new User('1', "tungnguyen@umass.edu", "ilovecs326", "Tung", 3, "Male", ["../figures/cat_pic/cat4.jpg", "../figures/cat_pic/cat5.jpg", "../figures/cat_pic/cat6.jpg"], "Meo Cho")
const propUser3 = new User('2', "minhnguyen@umass.edu", "ilovecs326", "Minh", 3, "Male", ["../figures/cat_pic/cat9.jpg", "../figures/cat_pic/cat8.jpg", "../figures/cat_pic/cat7.jpg"], "Meo Ngu", ["1", "0"])
const propUser4 = new User('3', "hcao@umass.edu", "ilovecs326", "Huy", 3, "Male", ["../figures/cat_pic/cat10.jpg", "../figures/cat_pic/cat11.jpg", "../figures/cat_pic/cat12.jpg"], "Meo Dan")
const propUser5 = new User('4', "bede@umass.edu", "ilovecs326", "May", 3, "Male", ["../figures/cat_pic/cat10.jpg", "../figures/cat_pic/cat11.jpg", "../figures/cat_pic/cat12.jpg"], "Meo Ngu")
const users = [propUser1, propUser2, propUser3, propUser4, propUser5]
const availableId = ['0', '1', '2', '3', '4'];
users.forEach(async (user) => {
    const existingUser = await findUserByEmailAndPassword(user.email, user.password);
    if (!existingUser) {
        await dbUser.put({_id: user.getId(), ...user});
    }
});

/**
 * Find a user by email and password in the database.
 * @async
 * @function findUserByEmailAndPassword
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object|null>} Returns the user object if found, otherwise returns null.
 */
export async function findUserByEmailAndPassword(email, password) {
    try {
        const result = await dbUser.allDocs({ include_docs: true });
        const profiles = result.rows.map(row => row.doc);
        const user = profiles.find(profile => profile.email === email && profile.password === password);
        return user;
    } catch (error) {
        console.error("Error fetching profiles: ", error);
        return null;
    }
}

/**
 * Find a user by email in the database.
 * @async
 * @function findUserByEmail
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|null>} Returns the user object if found, otherwise returns null.
 */
export async function findUserByEmail(email) {
    try {
        const result = await dbUser.allDocs({ include_docs: true });
        const profiles = result.rows.map(row => row.doc);
        const user = profiles.find(profile => profile.email === email);
        return user;
    } catch (error) {
        console.error("Error fetching profiles: ", error);
        return null;
    }
}

/**
 * Get all available user profiles from the database.
 * @async
 * @function getAvailableProfiles
 * @returns {Promise<Array>} Returns an array of user profile objects.
 */
export async function getAvailableProfiles() {
    try {
        const result = await dbUser.allDocs({ include_docs: true });
        const profiles = result.rows.map(row => row.doc);
        return profiles;
    } catch (error) {
        console.error("Error fetching profiles: ", error);
        throw error;
    }
}

/**
 * Update a user profile in the database.
 * @async
 * @function updateProfileInfo
 * @param {string} _id - The ID of the user profile to update.
 * @param {Object} user - The updated user object.
 * @returns {Promise<void>}
 */
export async function updateProfileInfo(_id, user) {
    try {
        console.log(user)
        const profile = await dbUser.get(_id);
        await dbUser.remove(profile);
        await dbUser.put({ _id: _id, ...user });
        console.log("Profile updated successful");
    } catch (error) {
        console.error("Error updating profile: ", error);
        throw error;
    }
}

/**
 * Delete a user profile from the database.
 * @async
 * @function deleteProfileInfo
 * @param {string} id - The ID of the user profile to delete.
 * @returns {Promise<void>}
 */
export async function deleteProfileInfo(id) {
    try {
        console.log("Profile to delete: ", id);
        const profile = await dbUser.get(id);
        console.log("Profile to delete: ", profile);
        await dbUser.remove(profile);
        console.log("Profile deleted successfully");
    } catch (error) {
        console.error("Error deleting profile: ", error);
        throw error;
    }
}

/**
 * Create a new user profile in the database.
 * @async
 * @function createNewProfile
 * @param {Object} user - The new user object to create.
 * @returns {Promise<void>}
 */
export async function createNewProfile(user) {
    try {
        const existingUser = await findUserByEmail(user.email);
        if (!existingUser) {
          await dbUser.put({ _id: user.email, ...user });
          console.log("New profile created successfully");
        } else {
            alert("Email already exists");
        }
        
    } catch (error) {
        console.error("Error creating profile: ", error);
        throw error;
    }
}