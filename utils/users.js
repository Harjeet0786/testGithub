const users = [];

// join users to chat
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
//user leaves user

function userLeave(id) {
    // console.log("kdsfmslkdfgmsdklngf")
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers

}