/**
 * @class BaseEntity represent the base class for all entities stored in database
 */
class BaseEntity {

    /**
     * Constructor for BaseEntity
     * @param {number} id - The id of the entity
     */
    constructor (id) {
        this.id = id;
    }
}

export default BaseEntity;