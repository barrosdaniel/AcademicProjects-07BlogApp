// Initialise Express
var express = require('express');
var app = express();

// Initialise body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Initialise mongoose
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });

// Initialise method-override
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Initialise express-sanitizer
var expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

// Initialise ejs
app.set('view engine', 'ejs');

// Set-up public folder
app.use(express.static('public'));

// Set-up database schema and model
// Mongoose Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
// Mongoose model
var Blog = mongoose.model('Blog', blogSchema);

// RESTful ROUTES
// Index routes
app.get('/', function (req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log('Error loading data from database.');
        } else {
            console.log('Data loaded from database.');
            res.render('index', {blogs: blogs});
        }
    });
});

// New route
app.get('/blogs/new', function (req, res) {
    res.render('new');
});

// Create route
app.post('/blogs', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log('Error writing to the database.');
        } else {
            console.log('New blog post successfully created.');
            res.redirect('/blogs');
        }
    });
});

// Show route
app.get('/blogs/:id', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log('Error connecting to the database.');
        } else {
            console.log('Data successfully retrieved from database.');
            res.render('show', {blog: foundBlog});
        } 
    });
});

// Edit route
app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log('Error connecting to the database.');
        } else {
            console.log('Data successfully retrieved from database.');
            res.render('edit', {blog: foundBlog});
        }
    });
});

// Update route
app.put('/blogs/:id', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            console.log('Error updating data in the database.');
        } else {
            console.log('Successfully updated data in the database.');
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Destroy route
app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log('Error deleting data from the database.');
        } else {
            console.log('Successfully deleted data from the database');
            res.redirect('/blogs');
        }
    });
});

// Initialise server
app.listen(3000, function () {
    console.log('Blog App server has started on port 3000');
});

// Mock data creation
// Blog.create([
//     {
//       "title": "proident cillum",
//       "image": "http://placehold.it/300x200",
//       "body": "fugiat officia ut et ad consectetur culpa excepteur Lorem dolor dolor mollit aliqua anim consequat esse ad deserunt cillum nisi anim pariatur consectetur nostrud culpa labore ea non dolor veniam tempor tempor dolore fugiat duis sit enim reprehenderit cillum cupidatat quis labore eu fugiat ex consectetur in mollit aute sit laborum anim sint minim anim aliqua est proident reprehenderit non nostrud incididunt fugiat sunt consequat anim eiusmod tempor voluptate mollit enim qui sint id adipisicing quis aute laboris cupidatat culpa cupidatat voluptate commodo pariatur qui elit non nulla laboris cillum irure eu consequat duis excepteur proident non exercitation commodo et duis mollit velit laborum excepteur sit cupidatat quis fugiat duis do incididunt aliquip laborum magna officia nostrud magna sint cillum consequat culpa magna do nulla occaecat ut occaecat irure aliquip sit dolore cillum laborum labore sunt enim in exercitation velit fugiat culpa eu ea nostrud et mollit consectetur nulla sit minim tempor dolore non est aliquip eu commodo eiusmod voluptate quis culpa culpa consequat tempor do quis esse est sit id ut nulla duis Lorem deserunt do eiusmod irure ipsum officia proident ea qui ipsum reprehenderit ipsum enim in culpa labore id sunt labore sit eu tempor et ullamco occaecat cupidatat sunt proident enim culpa esse magna adipisicing sint amet ea dolor non non velit nulla eiusmod ullamco ipsum consectetur quis culpa et ipsum sunt laborum dolor sit esse sit aliquip anim fugiat voluptate incididunt cillum ut Lorem mollit dolor velit voluptate minim ullamco deserunt in ut esse labore dolore irure irure elit laborum eu duis exercitation exercitation in aliquip dolor laboris in magna irure duis occaecat dolore minim minim enim deserunt excepteur dolor enim ex excepteur sunt aliquip est exercitation ea cillum duis velit aliqua et ad proident eu est in ullamco duis nulla laborum aliquip dolor quis dolor fugiat et veniam dolor labore occaecat velit minim est proident et dolore incididunt elit incididunt id irure elit incididunt aliquip velit adipisicing do Lorem esse excepteur ipsum et consequat sint veniam occaecat ullamco nulla anim aliqua eiusmod sit magna do sint nisi laborum sint occaecat reprehenderit ea aute consequat proident occaecat Lorem commodo adipisicing anim eiusmod labore enim anim aute dolore commodo consectetur officia laborum eu Lorem anim reprehenderit amet duis deserunt consequat quis enim dolor excepteur excepteur eiusmod in in fugiat aliqua mollit culpa pariatur consequat laboris qui aute nulla eiusmod qui duis velit dolor commodo magna exercitation elit velit ullamco ea cupidatat duis enim ad qui ullamco cupidatat occaecat ea esse velit do aliqua duis enim exercitation voluptate nisi labore dolore qui magna sit voluptate cillum amet exercitation labore sint ipsum aliqua tempor quis dolore aute officia minim adipisicing officia dolor in aliqua ex esse officia aliquip duis culpa eiusmod esse id aliqua ut proident ullamco laborum non qui nulla Lorem ullamco esse amet in commodo do et qui tempor excepteur id pariatur esse dolor velit officia veniam nulla anim aute velit consequat ad aliquip anim irure mollit incididunt cupidatat occaecat incididunt aliqua sunt consectetur quis nostrud non",
//       "registered": "2014-02-26T11:10:14 -08:00"
//     },
//     {
//       "title": "adipisicing incididunt",
//       "image": "http://placehold.it/300x200",
//       "body": "sit irure aute labore magna mollit non duis eu dolore ea consequat minim nulla laboris sunt eiusmod Lorem commodo pariatur amet enim elit adipisicing in enim officia minim ad aute fugiat enim occaecat proident ipsum labore sint officia eu deserunt laboris laborum enim tempor cupidatat laboris qui do elit anim anim enim nulla aliqua eu voluptate ut eiusmod veniam eu ipsum sunt duis proident incididunt est amet Lorem duis anim duis sit ipsum nisi aliqua occaecat ipsum nisi labore non nulla voluptate et elit Lorem in duis pariatur irure et sint aliquip do incididunt non sunt tempor occaecat nostrud elit culpa excepteur excepteur cupidatat incididunt aliqua sit et labore culpa eiusmod aute excepteur labore irure commodo duis minim sit in proident officia commodo qui veniam quis occaecat dolor ipsum magna nostrud consectetur irure ad non Lorem cupidatat aute velit incididunt adipisicing cillum elit aliqua duis do esse sunt commodo sunt pariatur et nisi quis sit eu magna occaecat enim mollit duis nisi anim dolor ipsum ex ut nisi aliquip occaecat magna deserunt irure aliqua aute excepteur sint occaecat velit dolore cupidatat in cillum proident reprehenderit non duis duis ex occaecat sint ut consequat esse ipsum incididunt ea ex in dolor minim aliqua do occaecat id occaecat qui in dolor labore do excepteur do incididunt ex elit aliquip enim irure laboris eu quis sit consequat est est aliquip deserunt esse non reprehenderit esse ex proident do cupidatat eiusmod quis Lorem deserunt quis cillum ipsum mollit aliqua culpa aliquip esse aute sunt minim ex cillum sint qui reprehenderit cillum commodo elit non consectetur nostrud adipisicing non qui velit qui laborum laboris in ea enim sit ea occaecat et est et occaecat eu excepteur qui aliquip nisi ad velit ut ex commodo aute veniam sunt aute dolore veniam incididunt exercitation anim exercitation aute ipsum in non commodo ea voluptate reprehenderit reprehenderit magna et laborum magna commodo enim nostrud labore veniam sunt velit velit duis nulla pariatur labore ullamco qui culpa magna cillum sint laboris labore nulla magna anim aliquip enim pariatur qui tempor laborum ea minim aliqua sint aute nisi elit ut laborum labore et esse quis anim aliqua tempor reprehenderit aute consectetur sit proident nostrud sint officia mollit commodo duis eu laboris esse quis duis veniam eu pariatur esse sit ad id irure consequat velit ea ullamco anim in voluptate ad fugiat ut elit aliqua tempor magna do ad ut amet est anim ullamco ea commodo consequat et minim nulla adipisicing anim culpa adipisicing ullamco enim mollit sint nisi cupidatat consequat aliqua non cupidatat deserunt tempor labore ex laboris enim laborum deserunt minim et consectetur in ea occaecat amet cillum labore sunt in qui labore do esse qui dolor voluptate nostrud labore duis dolor ad cupidatat aute in eiusmod occaecat est magna ipsum dolor enim adipisicing esse do aute ad magna nostrud magna tempor consectetur commodo deserunt ipsum commodo cillum fugiat minim consequat ea Lorem consequat deserunt ea est cupidatat occaecat est mollit sint Lorem adipisicing nisi fugiat ex exercitation duis proident",
//       "registered": "2014-06-02T05:39:40 -08:00"
//     },
//     {
//       "title": "mollit magna",
//       "image": "http://placehold.it/300x200",
//       "body": "laborum Lorem eu elit magna adipisicing officia nostrud enim consectetur tempor dolore incididunt anim Lorem aute eiusmod reprehenderit velit amet fugiat officia occaecat consectetur adipisicing incididunt aliqua in proident excepteur commodo enim minim non voluptate adipisicing cupidatat sunt culpa ut excepteur irure aute occaecat et occaecat sit eu proident tempor nisi qui in minim laborum mollit velit mollit nulla veniam consectetur voluptate cillum ex pariatur culpa deserunt fugiat officia amet pariatur enim ex qui reprehenderit ullamco fugiat magna tempor cupidatat nostrud sit nulla consectetur est irure non cillum amet esse irure reprehenderit cillum minim ullamco eiusmod reprehenderit magna magna commodo cillum laboris esse aliquip nostrud id amet sit culpa enim non esse pariatur cupidatat incididunt elit dolore ea dolor aute exercitation magna qui labore pariatur quis amet in laboris non qui incididunt officia exercitation anim tempor velit duis laboris aute culpa pariatur ad fugiat voluptate ut labore et duis proident non irure et ea culpa labore laborum sunt veniam velit do tempor laborum nostrud minim eu et ad id nostrud sit reprehenderit eu ad nisi qui ad ut Lorem laborum esse nulla duis deserunt ea exercitation cupidatat exercitation esse do reprehenderit occaecat quis veniam reprehenderit laborum ex eiusmod excepteur culpa consectetur duis ipsum voluptate proident ad excepteur deserunt velit velit ullamco culpa nisi occaecat in mollit aute sint nisi amet fugiat laboris incididunt nisi sunt ipsum non magna anim cupidatat cupidatat irure eu et aliquip ex Lorem aliqua duis enim commodo cupidatat dolore velit consectetur Lorem proident consectetur ut labore consequat magna cupidatat nostrud elit esse laboris anim officia aliqua minim elit in in veniam sunt minim mollit esse do veniam excepteur et velit eiusmod ex et laborum Lorem id do exercitation veniam culpa dolore laborum adipisicing occaecat proident sit consectetur minim qui do anim excepteur proident aliquip aliquip nostrud laboris culpa quis velit eiusmod amet pariatur cupidatat aute amet fugiat deserunt consectetur irure do eu incididunt nulla in irure Lorem ipsum do adipisicing excepteur consectetur Lorem sint incididunt id ipsum aute magna esse eu ullamco sunt elit ex exercitation dolore exercitation pariatur aliqua dolore velit ea labore duis ut eu reprehenderit duis cupidatat voluptate ut nostrud incididunt nulla aliquip culpa nulla nostrud eu enim quis occaecat adipisicing est irure velit magna magna et reprehenderit reprehenderit proident deserunt aute ullamco nostrud do labore eiusmod sit laboris in non enim id nulla est qui fugiat occaecat aliqua fugiat ullamco aliquip veniam consectetur officia ipsum aute esse et exercitation aute nulla sunt aliquip ut occaecat tempor mollit aliqua ex do ut enim sunt minim mollit nisi ullamco adipisicing non excepteur aute quis labore labore proident pariatur nostrud elit culpa adipisicing sunt cupidatat ipsum aute sint irure aliquip sint fugiat fugiat cupidatat Lorem aliquip do aliqua laboris occaecat nostrud enim commodo aute adipisicing et reprehenderit duis ex laborum veniam nulla ea aute proident cupidatat eu occaecat deserunt non commodo esse esse eu enim et nostrud irure eu laborum irure velit anim commodo et ipsum ea ut sunt culpa consequat consectetur proident dolor incididunt",
//       "registered": "2016-01-06T01:32:21 -08:00"
//     },
//     {
//       "title": "deserunt consectetur",
//       "image": "http://placehold.it/300x200",
//       "body": "cillum sit sunt officia cupidatat laborum nostrud qui amet Lorem cillum ea qui cillum veniam non tempor duis id Lorem eiusmod ut nostrud anim officia sit consectetur aliqua aliquip magna laborum Lorem eiusmod eiusmod ad voluptate est nisi irure eu non aliqua magna ea fugiat nisi ex amet dolor dolore adipisicing quis duis labore adipisicing sint tempor laboris cupidatat mollit est occaecat aliqua voluptate proident dolor ipsum ut amet non do minim ullamco laboris aute minim qui enim laboris duis cupidatat quis ipsum esse quis laboris esse anim exercitation incididunt mollit proident proident consectetur velit id commodo proident eiusmod elit anim et cupidatat nisi adipisicing velit enim aliqua Lorem est laborum excepteur ullamco fugiat in pariatur incididunt ullamco ipsum et consectetur nulla ex consectetur eu quis ex do aute excepteur consectetur amet minim aliquip aliqua non aliqua dolor pariatur do labore do dolore sit velit sint adipisicing aliqua officia excepteur laboris proident elit ad et enim ex ea officia consectetur consectetur cupidatat nisi irure voluptate commodo tempor mollit amet laboris culpa voluptate aliqua elit sit quis anim magna duis reprehenderit aliqua commodo elit ea nulla labore sit dolore irure fugiat do fugiat labore occaecat magna nostrud reprehenderit aliqua esse esse sunt Lorem ex cillum minim magna elit cillum velit aute officia quis reprehenderit magna ullamco exercitation quis quis qui minim anim quis esse laboris voluptate quis incididunt culpa excepteur est ut minim eu magna nulla exercitation ea excepteur adipisicing elit nostrud quis laboris ipsum laborum aute culpa voluptate laborum ea voluptate in qui mollit laboris fugiat laboris exercitation ea minim irure quis qui ut sunt tempor anim velit sunt tempor proident elit consectetur ut qui enim minim sit sit culpa Lorem eiusmod est nisi dolore minim consequat qui occaecat dolor commodo proident occaecat anim qui qui pariatur ipsum deserunt irure cupidatat esse pariatur commodo proident irure voluptate aliquip ullamco veniam adipisicing ad nulla exercitation adipisicing mollit laboris nulla tempor mollit sint dolore fugiat commodo veniam cillum fugiat eiusmod ullamco voluptate aute consectetur nulla ipsum nostrud ex eiusmod non in consequat exercitation culpa ut sint ad sint nostrud esse quis sint adipisicing sunt amet esse mollit consectetur aliqua sit aliqua consectetur laboris quis occaecat qui occaecat sit do laborum exercitation veniam amet dolor est voluptate deserunt laboris nulla ad excepteur aliqua cupidatat anim ut irure sit qui laboris esse ex esse velit enim laborum aliqua reprehenderit officia excepteur veniam laboris deserunt voluptate esse ea incididunt excepteur consectetur reprehenderit ea do proident tempor veniam quis sit ut incididunt in esse velit sit minim adipisicing cupidatat aliqua excepteur fugiat cillum laboris dolore nostrud ipsum pariatur esse aute nisi ad proident ipsum esse esse duis cillum ad labore eu aute consectetur duis anim cillum ipsum magna Lorem ad et dolore ullamco occaecat minim Lorem id tempor sint cupidatat amet officia incididunt sit dolor labore voluptate dolor occaecat velit duis cupidatat et reprehenderit quis dolore elit culpa nulla veniam aliqua magna dolore dolore irure est aliqua velit veniam in laboris cupidatat est excepteur magna duis",
//       "registered": "2015-10-15T02:31:46 -08:00"
//     },
//     {
//       "title": "et sint",
//       "image": "http://placehold.it/300x200",
//       "body": "aute ex ullamco Lorem pariatur dolor nisi in tempor sunt culpa et aliqua culpa sit velit aliquip mollit dolore est magna labore nulla aute do magna esse pariatur sunt fugiat tempor irure nostrud nisi in est in aliqua Lorem proident qui irure qui id do eiusmod incididunt sint aute voluptate id tempor aliquip nostrud ipsum sint ad est tempor laborum sit minim dolor labore consequat ad ex esse ad ut nostrud magna ex est in exercitation elit esse velit fugiat esse exercitation ullamco cupidatat id amet qui ullamco qui pariatur ex amet voluptate mollit reprehenderit excepteur fugiat commodo cupidatat deserunt velit fugiat irure ex do irure dolore duis sint nostrud nostrud est in excepteur velit exercitation excepteur sint eu culpa amet nostrud ad qui cillum fugiat minim qui occaecat velit velit aute est proident voluptate dolor aute aliquip sunt consequat veniam dolor velit irure occaecat culpa culpa velit sit qui irure voluptate ut fugiat exercitation ea adipisicing eu ad in dolor proident esse sit reprehenderit excepteur velit excepteur sint mollit est dolor consectetur enim deserunt culpa nostrud adipisicing non anim consequat enim in esse Lorem laborum ad laboris labore officia officia laborum laboris mollit sit tempor amet sint in elit et esse do dolore magna magna ipsum reprehenderit nostrud reprehenderit magna eu ea dolor occaecat cupidatat ad nostrud dolor ut non velit irure id duis non proident incididunt fugiat ex ad deserunt cillum veniam ipsum do proident ut consequat irure occaecat tempor exercitation sint ea labore mollit ea veniam non magna magna dolor mollit amet ipsum cillum voluptate exercitation ea consectetur eiusmod dolor qui consectetur officia Lorem enim tempor sint consequat Lorem eu id exercitation cupidatat excepteur excepteur labore veniam id consectetur in mollit sit exercitation Lorem aliqua in do eiusmod tempor consectetur duis nisi cillum est eiusmod enim anim qui aute pariatur esse reprehenderit aliquip ad dolore est voluptate officia enim voluptate tempor quis laborum est eiusmod consequat in nisi proident et fugiat dolore cillum id consectetur dolor enim ea irure mollit irure dolor dolore aliquip Lorem ipsum ut eiusmod proident veniam mollit et laboris laborum aliquip cillum officia consectetur irure aliquip occaecat anim consectetur dolor reprehenderit irure ipsum deserunt sunt consequat enim mollit nostrud duis enim id eu laborum cupidatat tempor fugiat dolor duis consequat cillum officia officia commodo velit est qui est non qui consectetur eu occaecat incididunt et id eiusmod id commodo est incididunt ipsum ad occaecat pariatur excepteur aute eu irure do adipisicing tempor dolor qui elit veniam quis officia amet occaecat mollit eu proident nostrud est exercitation cupidatat consequat non aliquip consectetur ullamco adipisicing ad nulla sunt et voluptate dolore officia consectetur elit elit quis non pariatur voluptate velit esse laborum nulla fugiat irure culpa ea fugiat et mollit culpa voluptate nisi adipisicing tempor duis enim irure eiusmod exercitation sunt consectetur aute cillum labore mollit ad minim Lorem esse nostrud eiusmod veniam nostrud cillum minim velit aute cupidatat ut officia Lorem tempor fugiat laborum tempor duis sint ullamco aute dolor incididunt et do minim",
//       "registered": "2015-10-13T08:38:43 -08:00"
//     },
//     {
//       "title": "quis veniam",
//       "image": "http://placehold.it/300x200",
//       "body": "do sint duis ullamco et tempor minim pariatur sit ipsum duis enim quis enim ad in enim pariatur nulla aute Lorem consequat exercitation in dolore sint est amet commodo consequat ut ea ea dolore officia proident duis et fugiat ullamco occaecat consequat laborum quis nisi ex laboris incididunt consectetur ullamco veniam cupidatat mollit ut mollit excepteur culpa incididunt eu duis quis occaecat non labore ex esse sunt cillum occaecat mollit ea sunt ut sit do est culpa deserunt amet eiusmod enim officia anim culpa cillum elit ullamco aliqua pariatur eu mollit labore culpa excepteur occaecat aliqua excepteur labore ea ad proident id aliqua ullamco nostrud est id amet eiusmod et voluptate ea irure nisi incididunt ipsum sunt Lorem dolor laboris laboris dolor sint amet veniam dolore voluptate eu quis esse in elit ipsum qui sunt reprehenderit eu ut deserunt esse veniam nulla labore fugiat elit deserunt non ex cupidatat aliqua excepteur ut excepteur non mollit irure magna incididunt magna dolore dolore ea ut sint irure nostrud occaecat velit culpa esse commodo enim anim officia in culpa culpa est consequat irure officia et reprehenderit eu consequat proident duis minim anim labore voluptate irure amet labore qui veniam ad exercitation eu cupidatat in elit sunt veniam amet laborum id reprehenderit cupidatat et ad est consequat ipsum est reprehenderit amet occaecat occaecat laboris mollit reprehenderit elit do proident minim officia tempor laborum enim dolore ad incididunt veniam anim proident nisi occaecat nisi mollit amet ex voluptate exercitation esse esse laborum aute ut minim elit nostrud laboris nulla deserunt duis cupidatat sit duis incididunt excepteur duis consectetur quis veniam tempor irure quis eu nostrud reprehenderit esse exercitation pariatur consequat laboris non excepteur et commodo exercitation exercitation ex laboris nulla nulla aliqua mollit tempor sit aliquip tempor amet sint laboris qui velit culpa commodo ad labore ea incididunt anim dolor ad laboris consectetur reprehenderit duis ex proident voluptate eu eiusmod ea ut excepteur elit non tempor aliqua excepteur adipisicing sunt veniam elit esse esse velit mollit eu proident veniam mollit ad reprehenderit anim incididunt do magna et labore aliqua sunt aliquip eiusmod cupidatat tempor irure ad nisi proident minim ipsum ut Lorem labore tempor qui non enim nisi excepteur occaecat consequat ad exercitation qui non aute aute deserunt tempor quis anim nisi irure incididunt exercitation Lorem sint et sit do nulla aliqua deserunt id mollit veniam est eu incididunt do incididunt ad dolore et anim proident veniam do reprehenderit cillum qui irure fugiat cillum consequat laborum pariatur eu minim duis laborum veniam do aute non cupidatat velit nostrud excepteur magna cillum quis elit incididunt consequat ut esse eiusmod elit deserunt anim aliquip et tempor incididunt eu sint in nulla reprehenderit qui elit voluptate consectetur cupidatat ea do amet deserunt et aliqua dolore sunt veniam aliquip sit ex ullamco incididunt amet est occaecat mollit exercitation amet proident dolore dolor duis reprehenderit fugiat dolor eu Lorem irure elit do sint duis veniam et irure qui aliqua sit ullamco ea cillum et sit laborum culpa sit sint proident",
//       "registered": "2016-02-03T07:37:48 -08:00"
//     }
//   ]);