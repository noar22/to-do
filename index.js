const express=require(  "express" );
const bodyParser=require(  "body-parser" );
const mongoose=require('mongoose');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var items=[];
var itemsWork=[];
var t=0;
var i=0;
mongoose.connect('mongodb://127.0.0.1:27017/todo');
const todoSchema=new mongoose.Schema( {
  name: String
} ) ;

const Item=mongoose.model("Item", todoSchema);
const item1=new Item({
  name: "doing yoga"
} );

const item2=new Item({
  name:"making a cake"
} );

const item3=new Item({
  name: "reading a book"
} );

const array=[item1,item2,item3];

const listSchema=new mongoose.Schema({
  name: String,
  listSp:[todoSchema]
} );

const List=mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}).then(function(foundItems){
    res.render("index.ejs", {items2: foundItems} );
  } )
  .catch(function(err){
    console.log(err);
  });
} );



  app.get("/:paramName", (req, res) => {
    const listCustom=req.params.paramName;
    List.findOne({name: listCustom} ).then(function(list){
      if(list){
        res.render("work.ejs", {title:listCustom ,itemsWork2: list.listSp});
      } else {
        const list=new List({
          name: listCustom,
          listSp: array
        } );
        list.save();
        res.redirect("/" + listCustom);
      }
    })
    .catch(function(err){
      console.log(err);
    });
  } );


  app.post("/submit", (req, res) => {
  const itemNew = req.body["newItem"];
  const itemnew=new Item({
    name:itemNew
  } );
  itemnew.save();
  res.redirect("/");

});

app.post("/delete",(req, res) =>{
const itemDelete=req.body["checkbox"] ;
Item.findByIdAndRemove(itemDelete).then (function(){
  console.log("remove");
  res.redirect("/");
} )
.catch(function(err){
  console.log(err);
})
} );

app.post("/submitWork", (req, res) => {
  const itemNew = req.body["newItem2"];
  const itemnew=new Item({
    name:itemNew
  } );
  itemnew.save();
  const list=req.body["list"];
  List.findOne({name: list} ).then(function(listFound){
    listFound.listSp.push(itemnew);
    listFound.save();
    res.redirect("/"+ list);
  } )
  .catch(function(err){
    console.log(err);
  })

});

app.post("/deleteWork", (req, res) => {
  const ourList=req.body["listName"] ;
  const itemDelete=req.body["checkbox"]
  List.findOneAndUpdate({name:ourList},{$pull: {listSp:{_id: itemDelete}}} ).then(function(foundList){
    res.redirect("/" + ourList);
  })
  .catch(function(err){
    console.log(err);
  });
} );




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
