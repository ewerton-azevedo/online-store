const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const storeSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: 'The name field is required. Please enter a store name!'
    },

    slug: String,

    description:{
        type: String,
        trim: true
    },

    tags:[String], 

    created: {
        type: Date,
        default: Date.now
    },

    location:{
        type: {
            type: String,
            default: 'Point'
        },

        coordinates: [
            {
                type: Number,
                required: 'You must supply coordinates!'
            }
        ],

        address: {
            type: String,
            required: 'You must supply an address!'
        }
    }, 
    
    photo: String,
    
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }

}, {
    toJSON:{ virtuals: true },
    toObject:{ virtuals: true }
})

 /* Define Indexes
    Indexing the fields we search the most to speed up db queries
    create a field type text will facilitate the search tool implementation
 */
 storeSchema.index({
     name: 'text',
     description: 'text'
 })

 storeSchema.index({ location:'2dsphere' })

storeSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next()
        return
    }
    this.slug = slug(this.name)

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find( { slug: slugRegEx })
    
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`
    }

    //Todo: Implement slug with address

    next();
})

storeSchema.statics.getTagsList = function(){
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

//find reviews where the stores _id property === reviews store property
storeSchema.virtual('reviews', {
    ref: 'Review', //reference the model - what model to link to
    localField: '_id', //field on the store
    foreignField: 'store' //field on the review
})

module.exports = mongoose.model('Store', storeSchema)