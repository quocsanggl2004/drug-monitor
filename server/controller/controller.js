// Tính số lượng thuốc cần mua cho đủ số ngày
exports.calculatePurchase = async (req, res) => {
    const days = Number(req.body.days || req.query.days);
    if (!days || days <= 0) {
        return res.status(400).send({ message: "Invalid days" });
    }
    try {
        const drugs = await Drugdb.find();
        // Giả sử mỗi thuốc có perDay là số lượng cần dùng mỗi ngày
        const result = drugs.map((drug, idx) => {
            // Số pack cần mua = ceil(perDay * days / packSize), packSize giả sử là 1 (nếu có trường packSize thì dùng)
            // Số card cần mua = ceil(perDay * days / cardSize), cardSize giả sử là 1 (nếu có trường cardSize thì dùng)
            // Nếu không có packSize/cardSize, chỉ tính tổng số cần dùng
            const total = drug.perDay * days;
            return {
                id: drug._id,
                drugName: drug.name,
                cardsToBuy: Math.ceil(total),
                packsToBuy: Math.ceil(total),
            };
        });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error calculating purchase" });
    }
};
let Drugdb = require('../model/model');


// creates and saves a new drug
exports.create = (req,res)=>{
    // validate incoming request
    if(!req.body){// if content of request (form data) is empty
        res.status(400).send({ message : "Content cannot be emtpy!"});// respond with this
        return;
    }

    //create new drug
    const drug = new Drugdb({
        name : req.body.name,//take values from form and assign to schema
        card : req.body.card,
        pack: req.body.pack,
        perDay : req.body.perDay,
        dosage : req.body.dosage
    })

    //save created drug to database
    drug
        .save(drug)//use the save operation on drug
        .then(data => {
            console.log(`${data.name} added to the database`) 
            res.redirect('/manage');
        })
        .catch(err =>{
            res.status(500).send({//catch error
                message : err.message || "There was an error while adding the drug"
            });
        });

}


// can either retrieve all drugs from the database or retrieve a single user
exports.find = (req,res)=>{

    if(req.query.id){//if we are searching for drug using its ID
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Can't find drug with id: "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving drug with id: " + id})
            })

    }else{
        Drugdb.find()
            .then(drug => {
                res.send(drug)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "An error occurred while retriving drug information" })
            })
    }
}


// edits a drug selected using its  ID
exports.update = (req,res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Cannot update an empty drug"})
    }

    const id = req.params.id;
    Drugdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Drug with id: ${id} cannot be updated`})
            }else{
                res.send(data);
                //res.redirect('/');
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error in updating drug information"})
        })

}


// deletes a drug using its drug ID
exports.delete = (req,res)=>{
    const id = req.params.id;

    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete drug with id: ${id}. Pls check id`})
            }else{
                res.send({
                    message : `${data.name} was deleted successfully!`
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Drug with id=" + id
            });
        });

}


// purchase function: giảm số lượng pack của thuốc
exports.purchase = async (req, res) => {
    const { id, quantity } = req.body;
    if (!id || !quantity || Number(quantity) <= 0) {
        return res.status(400).send({ message: "Missing or invalid id/quantity" });
    }
    try {
        const drug = await Drugdb.findById(id);
        if (!drug) {
            return res.status(404).send({ message: `Drug with id ${id} not found` });
        }
        if (drug.pack < quantity) {
            return res.status(400).send({ message: `Not enough pack. Available: ${drug.pack}` });
        }
        drug.pack -= Number(quantity);
        await drug.save();
        res.send({ message: `Purchased ${quantity} pack(s) of ${drug.name}. Remaining: ${drug.pack}` });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error during purchase" });
    }
};