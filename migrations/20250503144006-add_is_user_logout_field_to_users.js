module.exports = {
  /**
   * @param db 
   * @param client 
   * @returns {Promise<void>}
   */
  async up(db, client) {
    try {
      const collection = db.collection('users');
      await collection.updateMany(
        {},
        { $set: { is_user_logout: false } }
      );
      
      console.log("Migration applied: Added is_user_logout field to users collection.");
    } catch (error) {
      console.error("Error applying migration:", error);
    }
  },

  /**
   * @param db 
   * @param client
   * @returns {Promise<void>}
   */
  // async down(db, client) {
  //   try {
  //     const collection = db.collection('users');
  //     await collection.updateMany(
  //       {},
  //       { $unset: { is_user_logout: "" } } 
  //     );
      
  //     console.log("Rollback successful: Removed is_user_logout field from users collection.");
  //   } catch (error) {
  //     console.error("Error rolling back migration:", error);
  //   }
  // }
};
