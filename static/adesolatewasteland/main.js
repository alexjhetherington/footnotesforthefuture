var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main;
(function (Main) {
    var game = null;
    function start() {
        game = new Game();
    }
    Main.start = start;
    window.onload = function () {
        Main.start();
    };
    function step(timestamp) {
        if (game != null) {
            game.update(timestamp);
        }
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
    /*function step(){
    if(game != null){
      game.update(performance.now());
    }
  }
  setInterval(step, 30);
    //workerTimer.setInterval(step, 30);*/
    //test
})(Main || (Main = {}));
var building = /** @class */ (function () {
    //constructor(x : number, y : number){
    //  this.x = x;
    //  this.y = y;
    //}
    function building(map) {
        this.buildingMessage = null;
        this.width = 2;
        this.height = 2;
        this.adjacentWarpers = 0;
        this.blueprint = [
            '##',
            '##'
        ];
        this.maxWanderingChildren = 0;
        this.wanderingChildrenCount = 0;
        this.wandererDescription = "One of the burnt things wanders aimlessly.";
        this.map = map;
    }
    building.prototype.addWanderer = function () {
        this.wanderingChildrenCount += 1;
    };
    building.prototype.removeWanderer = function () {
        this.wanderingChildrenCount -= 1;
        if (this.wanderingChildrenCount < 0) {
            alert("Wanderer removed from building that had no wanderers");
        }
    };
    building.prototype.spawnWanderer = function () {
        if (this.map.spawnWanderer(this)) {
            this.wanderingChildrenCount++;
            if (this.wanderingChildrenCount > this.maxWanderingChildren) {
                alert("Spawned more than wanderer capacity.");
            }
            return true;
        }
        return false;
    };
    building.prototype.getWandererDescription = function () {
        return this.wandererDescription;
    };
    building.prototype.getBuildingMessage = function () {
        return this.buildingMessage;
    };
    building.prototype.getWidth = function () {
        return this.width;
    };
    building.prototype.getHeight = function () {
        return this.height;
    };
    building.prototype.setX = function (x) {
        this.x = x;
    };
    building.prototype.getX = function () {
        return this.x;
    };
    building.prototype.setY = function (y) {
        this.y = y;
    };
    building.prototype.getY = function () {
        return this.y;
    };
    building.prototype.getTile = function (x, y) {
        return this.blueprint[y][x];
    };
    building.prototype.getAdjacentWarpers = function () {
        return this.adjacentWarpers;
    };
    building.prototype.addAdjacentWarper = function () {
        this.adjacentWarpers += 1;
    };
    building.prototype.removeAdjacentWarper = function () {
        this.adjacentWarpers -= 1;
    };
    building.prototype.collides = function (building) {
        if (this.x + this.width <= building.getX() || building.getX() + building.getWidth() <= this.x ||
            this.y + this.height <= building.getY() || building.getY() + building.getHeight() <= this.y) {
            return false;
        }
        else {
            return true;
        }
    };
    building.prototype.collidesAny = function (buildings) {
        for (var i = 0; i < buildings.length; i++) {
            if (this.collides(buildings[i])) {
                return true;
            }
        }
        return false;
    };
    building.prototype.getMapRequirementsMet = function (buildings, roads) {
        return true;
    };
    building.prototype.getNextBones = function () {
        return this.getCostForXBuilt(this.map.getBuildingsCount(this) + 1);
    };
    building.prototype.getMostRecentBones = function () {
        return this.getCostForXBuilt(this.map.getBuildingsCount(this));
    };
    building.prototype.getCostForXBuilt = function (x) {
        alert("Building does not have bone formulae set set");
        return 0;
    };
    building.prototype.getDescription = function () {
        return this.description;
    };
    building.prototype.update = function (timestamp) {
    };
    building.prototype.getDeleteSouls = function () {
        return this.getMostRecentBones();
    };
    building.prototype.isAdjacentTo = function (adjacentTo) {
        if (this.x == adjacentTo.getX() && this.y == adjacentTo.getY()) { //same building!
            return false;
        }
        if ((!(this.y > adjacentTo.getY() + adjacentTo.getHeight() - 1 || this.y + this.getHeight() - 1 < adjacentTo.getY()) &&
            (this.x + this.getWidth() == adjacentTo.getX() || this.x == adjacentTo.getX() + adjacentTo.getWidth()))
            ||
                (!(this.x > adjacentTo.getX() + adjacentTo.getWidth() - 1 || this.x + this.getWidth() - 1 < adjacentTo.getX()) &&
                    (this.y + this.getHeight() == adjacentTo.getY() || this.y == adjacentTo.getY() + adjacentTo.getHeight()))) {
            return true;
        }
        return false;
    };
    building.prototype.getAllAdjacentTo = function (buildings) {
        var output = [];
        for (var i = 0; i < buildings.length; i++) {
            if (this.isAdjacentTo(buildings[i])) {
                output.push(buildings[i]);
            }
        }
        return output;
    };
    building.prototype.getEdgeCoordinates = function () {
        var coordinates = [];
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (x == 0 || y == 0 || x == this.getWidth() - 1 || y == this.getHeight() - 1) {
                    coordinates.push([this.getX() + x, this.getY() + y]);
                }
            }
        }
        return coordinates;
    };
    return building;
}());
var consumer = /** @class */ (function (_super) {
    __extends(consumer, _super);
    function consumer(map, resources, maxOccupants) {
        var _this = _super.call(this, map) || this;
        _this.currentOccupants = [];
        _this.expectedOccupants = [];
        _this.maxOccupants = maxOccupants;
        _this.resources = resources;
        return _this;
    }
    consumer.prototype.arrive = function (soulId) {
        if (!this.expectedOccupants.includes(soulId)) {
            alert("Soul arrived at building which wasn't expected. Oh no! Arrived: " + soulId);
        }
        this.removeValueFrom(soulId, this.expectedOccupants);
        this.currentOccupants.push(soulId);
        if (this.currentOccupants.length > this.maxOccupants) {
            alert('Building Exceeded max occupants');
        }
    };
    consumer.prototype.doNotArrive = function (soulId) {
        if (!this.expectedOccupants.includes(soulId)) {
            alert("Soul did not arrive at building which wasn't expected. Oh no! Did not arrive: " + soulId);
        }
        this.removeValueFrom(soulId, this.expectedOccupants);
    };
    consumer.prototype.removeValueFrom = function (soulId, arrayToRemoveFrom) {
        for (var i = 0; i < arrayToRemoveFrom.length; i++) {
            if (arrayToRemoveFrom[i] == soulId) {
                arrayToRemoveFrom.splice(i, 1);
                break;
            }
        }
    };
    consumer.prototype.addExpectedOccupant = function (soulId) {
        if (soulId != null) {
            this.expectedOccupants.push(soulId);
        }
    };
    consumer.prototype.getDeleteSouls = function () {
        return this.getMostRecentBones() + this.currentOccupants.length;
    };
    consumer.prototype.getCurrentOccupants = function () {
        return this.currentOccupants;
    };
    return consumer;
}(building));
var painBuildingTorture = /** @class */ (function (_super) {
    __extends(painBuildingTorture, _super);
    function painBuildingTorture(map, resources, maxOccupants, painPerSoulPerSecond) {
        var _this = _super.call(this, map, resources, maxOccupants) || this;
        _this.secondsSinceLastPainIncreaseTick = 0;
        _this.painPerSoulPerSecond = 0;
        _this.overduePain = 0;
        _this.nextWanderGenerate = 10;
        _this.timeSinceLastWanderGenerate = 0;
        _this.painPerSoulPerSecond = painPerSoulPerSecond;
        return _this;
    }
    painBuildingTorture.prototype.getPainPerSoulPerSecond = function () {
        return this.painPerSoulPerSecond * (1 + (0.1 * this.adjacentWarpers));
    };
    painBuildingTorture.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            //Calculate Pain
            this.secondsSinceLastPainIncreaseTick += ((timestamp - this.lastUpdate) / 1000);
            while (this.secondsSinceLastPainIncreaseTick >= 1) {
                this.secondsSinceLastPainIncreaseTick -= 1;
                this.overduePain += this.getPainPerSoulPerSecond() * this.currentOccupants.length;
                var remainder = this.overduePain - Math.floor(this.overduePain);
                this.resources.addPain(Math.floor(this.overduePain));
                this.overduePain = remainder;
            }
            //Request Souls
            if (this.currentOccupants.length < this.maxOccupants && this.expectedOccupants.length == 0) {
                this.addExpectedOccupant(this.map.requestActor(this));
            }
            if (this.wanderingChildrenCount < this.maxWanderingChildren) {
                this.timeSinceLastWanderGenerate += ((timestamp - this.lastUpdate) / 1000);
                if (this.timeSinceLastWanderGenerate > this.nextWanderGenerate) {
                    this.spawnWanderer();
                    this.timeSinceLastWanderGenerate = 0;
                    this.nextWanderGenerate = 5 + Math.random() * 30;
                }
            }
        }
        this.lastUpdate = timestamp;
    };
    return painBuildingTorture;
}(consumer));
var painBuildingKill = /** @class */ (function (_super) {
    __extends(painBuildingKill, _super);
    function painBuildingKill(map, resources, killingTime, painPerKill) {
        var _this = _super.call(this, map, resources, 1) || this;
        //Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
        _this.requestCoolDown = 2;
        _this.secondsSinceLastRequest = 0;
        _this.killingTime = 0;
        _this.killingTimeElapsed = 0;
        _this.painPerKill = 0;
        _this.nextWanderGenerate = 10;
        _this.timeSinceLastWanderGenerate = 0;
        _this.painPerKill = painPerKill;
        _this.killingTime = killingTime;
        return _this;
    }
    painBuildingKill.prototype.getKillingTime = function () {
        return this.killingTime * (1 / (1 + this.adjacentWarpers));
    };
    painBuildingKill.prototype.getPainPerKill = function () {
        return this.painPerKill;
    };
    painBuildingKill.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
            if (this.currentOccupants.length == 1) {
                this.killingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
                if (this.killingTimeElapsed > this.getKillingTime()) {
                    this.killingTimeElapsed = 0;
                    this.currentOccupants.splice(0, 1);
                    this.resources.turnSoulToBones();
                    this.resources.addPain(this.getPainPerKill());
                }
            }
            else if (this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown) {
                this.addExpectedOccupant(this.map.requestActor(this));
                this.secondsSinceLastRequest = 0;
            }
            if (this.wanderingChildrenCount < this.maxWanderingChildren) {
                this.timeSinceLastWanderGenerate += ((timestamp - this.lastUpdate) / 1000);
                if (this.timeSinceLastWanderGenerate > this.nextWanderGenerate) {
                    this.spawnWanderer();
                    this.timeSinceLastWanderGenerate = 0;
                    this.nextWanderGenerate = 5 + Math.random() * 30;
                }
            }
        }
        this.lastUpdate = timestamp;
    };
    return painBuildingKill;
}(consumer));
var actor = /** @class */ (function () {
    function actor(map, nodeGraph, colour) {
        if (colour === void 0) { colour = "red"; }
        this.pathFollower = new pathFollower();
        this.pf = new pathfinder();
        this.x = null;
        this.y = null;
        this.journeyDistance = 0;
        this.colour = null;
        this.map = map;
        this.nodeGraph = nodeGraph;
        this.colour = colour;
    }
    actor.prototype.getX = function () {
        return this.x;
    };
    actor.prototype.getY = function () {
        return this.y;
    };
    actor.prototype.putAtOrigin = function () {
        this.x = 0;
        this.y = 0;
    };
    actor.prototype.getJourneyDistance = function () {
        return this.journeyDistance;
    };
    actor.prototype.getColour = function () {
        return this.colour;
    };
    actor.prototype.spawnWithPathFromBuildingToBuilding = function (start, end) {
        var path = this.pf.findPathBetweenBuildings(start, end, this.nodeGraph);
        this.destination = end;
        this.pathFollower.setPath(path);
        this.journeyDistance = path.getLength();
    };
    actor.prototype.setPathToDestination = function (x, y) {
        if (!this.pathFollower.isTravelling()) {
            //TODO What to do if coords aren't exact
            //1 After a previous run
            //2 Halfway through a run
            var path = this.pf.findPathFromCoords(this.x, this.y, x, y, this.nodeGraph);
            //Path not found
            if (path != null) {
                this.pathFollower.setPath(path);
            }
            else {
                this.handleImpossibleDestination();
            }
        }
    };
    actor.prototype.arrive = function () { alert('arrive not set'); };
    actor.prototype.doNotArrive = function () { alert('do not arrive not set'); };
    actor.prototype.handleImpossibleDestination = function () { };
    actor.prototype.getDeleteSouls = function () {
        alert('Delete souls for actor not set');
        return 0;
    };
    actor.prototype.getDestination = function () {
        return this.destination;
    };
    actor.prototype.update = function (timestamp) {
        if (this.pathFollower != null) {
            this.pathFollower.update(timestamp);
            if (this.pathFollower.isFinished()) {
                this.arrive();
                return;
            }
            var nextWaypoint = this.pathFollower.getNextWayPoint();
            if (nextWaypoint == null) {
                alert("Waypoint is null but path isn't finished. How did you get here?");
            }
            if (!this.map.getRoad(nextWaypoint.x, nextWaypoint.y)) {
                //Road has been deleted
                this.doNotArrive();
                return;
            }
            var x = this.pathFollower.getX();
            var y = this.pathFollower.getY();
            if (x != null && y != null) {
                this.x = x;
                this.y = y;
            }
        }
    };
    return actor;
}());
var buildingView = /** @class */ (function () {
    function buildingView(parent, building, mapView) {
        this.div = null;
        this.li = null;
        this.building = null;
        this.mapView = null;
        this.parent = null;
        this.parent = parent;
        this.building = building;
        this.mapView = mapView;
        this.createView;
    }
    buildingView.prototype.getBuilding = function () {
        return this.building;
    };
    buildingView.prototype.createView = function () {
        var _this = this;
        this.div = document.createElement("div");
        var list = document.createElement("ul");
        list.className = "horzMenu";
        this.div.appendChild(list);
        this.createListButton(list, "Return", function () { _this.destroyView(); _this.mapView.createView(); });
        this.createInnerView();
        //Should be in a subclass
        if (this.building instanceof ghetto) {
            var asGhetto = this.building;
            this.li = document.createElement("ul");
            this.populateOccupants(asGhetto.getOccupants());
            this.div.appendChild(this.li);
        }
        //Should be in a subclass
        if (this.building instanceof painBuildingTorture) {
            var asTorture = this.building;
            this.li = document.createElement("ul");
            this.populateOccupants(asTorture.getCurrentOccupants());
            this.div.appendChild(this.li);
        }
        if (this.building instanceof ziggurat) {
            var asZiggurat = this.building;
            var soulsPar = document.createElement("p");
            soulsPar.innerHTML = asZiggurat.getSoulsConsumed() + "/" + asZiggurat.getSoulsRequired() + " souls consumed from The Eddy.";
            var button = document.createElement("button");
            button.innerHTML = "Perform Ritual";
            if (asZiggurat.getSoulsConsumed() >= asZiggurat.getSoulsRequired() || satanMode) {
                button.onclick = function () {
                    asZiggurat.end();
                };
            }
            else {
                button.className = "listFakeButton";
            }
            var ritualLabel = document.createElement("span");
            ritualLabel.innerHTML = asZiggurat.getAnguishRequired() + " Anguish";
            this.div.appendChild(soulsPar);
            this.div.appendChild(button);
            this.div.appendChild(ritualLabel);
        }
        this.parent.appendChild(this.div);
    };
    buildingView.prototype.createInnerView = function () {
        var description = document.createElement("p");
        description.innerHTML = this.building.getDescription();
        this.div.appendChild(description);
    };
    buildingView.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
        this.li = null;
    };
    buildingView.prototype.createListButton = function (list, label, effect) {
        var li = document.createElement('li');
        var button = document.createElement("button");
        button.innerHTML = label;
        button.onclick = effect;
        li.appendChild(button);
        list.appendChild(li);
    };
    buildingView.prototype.populateOccupants = function (soulIds) {
        var self = this;
        var clickSoul = function (arg) {
            return function () {
                self.destroyView();
                var resources = null;
                if (self.building instanceof ghetto) {
                    var asGhetto = self.building;
                    resources = asGhetto.getResources();
                }
                var newSoulView = new soulView(self.parent, arg, resources, self, self.mapView);
            };
        };
        //document.getElementById("flavour").innerHTML = occupants[0].name();
        for (var i = 0; i < soulIds.length; i++) {
            var listSoul = new soul(soulIds[i]);
            var list = document.createElement('li');
            //var listSoul = occupants[i];
            list.innerHTML = listSoul.name();
            list.className = "hoverable";
            //list.onclick = clickSoul(listSoul);
            list.onclick = clickSoul(listSoul);
            this.li.appendChild(list);
            //document.getElementById("flavour").innerHTML = i.toString();
        }
    };
    return buildingView;
}());
var charGenData;
(function (charGenData) {
    //Yes this approach is awful but i wanted to throw something together.
    //&pp possesive pronoun
    //&np normal pronoun
    //&mp
    //&ncpp possessive pronoun mid sentence
    //&ins where the content goes.
    charGenData.maleFirstNames = "Michael, Digby, Christopher, Matthew, Joshua, Jacob, Nicholas, Andrew, Daniel, Tyler, Joseph, Brandon, David, James, Ryan, John, Zachary, Justin, William, Anthony, Robert, Jonathan, Austin, Alexander, Kyle, Kevin, Thomas, Cody, Jordan, Eric, Benjamin, Aaron, Christian, Samuel, Dylan, Steven, Brian, Jose, Timothy, Nathan, Adam, Richard, Patrick, Charles, Sean, Jason, Cameron, Jeremy, Mark, Stephen, Jesse".split(', ');
    charGenData.femaleFirstNames = "Jessica, Ashley, Emily, Sarah, Samantha, Amanda, Brittany, Elizabeth, Taylor, Megan, Hannah, Kayla, Lauren, Stephanie, Rachel, Jennifer, Nicole, Alexis, Victoria, Amber, Alyssa, Courtney, Danielle, Rebecca, Jasmine, Brianna, Katherine, Alexandra, Madison, Morgan, Melissa, Michelle, Kelsey, Chelsea, Anna, Kimberly, Tiffany, Olivia, Mary, Christina, Allison, Abigail, Sara, Shelby, Heather, Haley, Maria, Kaitlyn, Laura, Erin".split(', ');
    charGenData.lastNames = "Hamilton, Smith, Jones, Taylor, Williams, Brown, Beale, Davies, Evans, Wilson, Thomas, Roberts, Johnson, Lewis, Walker, Robinson, Wood, Thompson, White, Watson, Jackson, Wright, Green, Harris, Cooper, King, Lee, Martin, Clarke, James, Morgan, Hughes, Edwards, Hill, Moore, Clark, Harrison, Scott, Young, Morris, Hall, Ward, Turner, Carter, Phillips, Mitchell, Patel, Adams, Campbell, Anderson, Allen, Cook, Bailey, Parker, Miller, Davis, Murphy, Price, Bell, Baker, Griffiths, Kelly, Simpson, Marshall, Collins, Bennett, Cox, Richardson, Fox, Gray, Rose, Chapman, Hunt, Robertson".split(', ');
    charGenData.fearPhrases = ["&pp greatest fear is of &ins.", "&np is terrified of &ins.", "&np is deathly afraid of &ins.", "&np feels uneasy at the thought of &ins.", "&np can only just tolerate the idea of &ins.", "The thought of &ins makes &mp anxious."];
    charGenData.fears = "a beer freely offered, other people, people of different race, seeing faces that aren't there, things not being in the right order, the ocean deep, sharks, breaking a bone, not having control, letting people down, being disliked, being ignored, being in a fight, being irrelevant, being wrong, not being the best, mirrors, elevators, babies, intimacy, being lost, betrayal, fire, God, you, clowns, drowning, spiders, heights, snakes, crowded spaces, open spaces, small spaces, dogs, thunder, balloons, fireworks, germs, flying, &ncpp teeth falling out, being alone, having no friends, failure, people finding out about &ncpp sexuality, people finding out about &ncpp fetish, talking on the phone, being fired, rejection, change,  the inevitable heat death of the universe, excercise".split(', ');
    charGenData.secretPhrases = [""];
    charGenData.secrets = [""];
    charGenData.desirePhrases = [""];
    charGenData.desires = [""];
    charGenData.generalThoughts = "Why are you doing this?, Yes., No., I need you God., Leave me alone., I can do this., I can't do this., Fuck you., Where am I?, What is this place?, ..., I don't remember..., I don't like it here., I'm scared, What is that looking at me?, Are those horns?, Am I dead?, I need to speak to a lawyer., I'm dreaming., Am I dreaming?, This isn't real., I'm not going to feel ok for a very long time., When will the drugs wear off?, It's a little too cold. Or is it too warm?, I'm starving., So... Tired..., I thought there would be more fire and brimstone., That was a mistake., I can't take it anymore., Please let it end., I don't want to feel anymore., Please don't hurt me., ...do you worst., There's nothing more you can do to me., Is this real?".split(', ');
})(charGenData || (charGenData = {}));
var concentrateView = /** @class */ (function () {
    function concentrateView(parent, resources, mapView) {
        this.parent = null;
        this.div = null;
        this.timeOut = 5;
        this.parent = parent;
        this.resources = resources;
        this.mapView = mapView;
        if (fastMode) {
            this.timeOut = 0.5;
        }
        this.createView();
    }
    concentrateView.prototype.createView = function () {
        this.div = document.createElement("div");
        var paragraph = document.createElement("p");
        paragraph.innerHTML = "Concentrating...";
        this.div.appendChild(paragraph);
        this.parent.appendChild(this.div);
        var thisConcentrate = this;
        //Stupid wrapping to save the scope because I'm using "this"
        window.setTimeout((function () {
            thisConcentrate.parent.removeChild(thisConcentrate.div);
            thisConcentrate.div = null;
            var newSoul = new soul(thisConcentrate.resources.getNextSoulId());
            new soulView(thisConcentrate.parent, newSoul, thisConcentrate.resources, null, thisConcentrate.mapView);
        }), this.timeOut * 1000);
    };
    return concentrateView;
}());
var endView = /** @class */ (function () {
    function endView(parent, resources, timePlayed) {
        var _this = this;
        this.endState = 0;
        this.endTexts = [
            "...",
            "Where is everything?",
            "Everything is white.",
            "What happened?",
            "You almost finished the ritual. No... That's not right. You did finish the ritual. And the precise moment you did...",
            "Where are you?",
            "Slowly, sounds come.",
            "A siren, and people chatting, concerned.",
            "You become aware of a weight on your back, and pain all over.",
            "No, not a weight. It's the floor, you're lying on the ground.",
            "You open your eyes.",
            "...",
            "A bustling street. People and buildings all around you. The perfect sky is crisscrossed with fluffy contrails. Everything is good."
        ];
        this.resources = resources;
        this.timePlayed = timePlayed;
        this.div = document.createElement('div');
        this.div.className = "bar";
        var dots = document.createElement('div');
        dots.innerHTML = "...";
        this.end = document.createElement('p');
        this.end.className = "hoverable";
        this.nextEnd();
        this.end.onclick = function () {
            _this.nextEnd();
        };
        parent.appendChild(this.div);
        this.div.appendChild(dots);
        this.div.appendChild(this.end);
        this.div.appendChild(document.createElement("hr"));
    }
    endView.prototype.nextEnd = function () {
        if (this.endState < this.endTexts.length - 1) {
            this.end.innerHTML = this.endTexts[this.endState++];
        }
        else {
            this.end.innerHTML = this.endTexts[this.endState++];
            this.end.className = "";
            this.end.onclick = null;
            this.div.removeChild(this.div.lastChild);
            this.timePlayed = this.timePlayed / 1000;
            var hours = Math.floor(this.timePlayed / (60 * 60));
            this.timePlayed -= hours * (60 * 60);
            var minutes = Math.floor(this.timePlayed / 60);
            this.timePlayed -= minutes * 60;
            var seconds = Math.floor(this.timePlayed);
            var score = document.createElement('p');
            score.innerHTML = "Thank you for playing! You completed the game in " + hours + " hours, " + minutes + " minutes and " + seconds + " seconds, and your remaining Anguish was " + this.resources.getPain() + " (higher is better!).";
            this.div.appendChild(score);
            this.div.appendChild(document.createElement("hr"));
            var advertising1 = document.createElement('p');
            advertising1.innerHTML = "My website is www.footnotesforthefuture.com";
            var advertising2 = document.createElement('p');
            advertising2.innerHTML = "You can email me at footnotesforthefuture@gmail.com";
            this.div.appendChild(advertising1);
            this.div.appendChild(advertising2);
        }
    };
    return endView;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.mapRenderer = null;
        this.resources = null;
        this.resourceView = null;
        this.statusView = null;
        this.firstUpdate = null;
        this.finished = false;
        this.loadingPopup = null;
        this.finishGame = function () {
            _this.finished = true;
            var children = document.body.childNodes;
            for (var i = children.length - 1; i >= 0; i--) {
                if (children[i] instanceof HTMLDivElement) {
                    document.body.removeChild(children[i]);
                }
            }
            var end = new endView(document.body, _this.resources, _this.lastUpdate - _this.firstUpdate);
        };
        showGhettoButton = false;
        showCrusherButton = false;
        showWarperButton = false;
        showPowerPlantButton = false;
        showBigCrusherButton = false;
        showPainBuildingButton = false;
        showZigguratButton = false;
        disableConcentrate = false;
        disabledConcentrateAlready = false;
        satanMode = false;
        fastMode = false;
        if (satanMode) {
            alert('Satan Mode Activated!');
            showGhettoButton = true;
            showCrusherButton = true;
            showWarperButton = true;
            showPowerPlantButton = true;
            showBigCrusherButton = true;
            showPainBuildingButton = true;
            showZigguratButton = true;
        }
        this.resources = new resources();
        this.map = new map(this.resources);
        this.resourceView = new resourceView(document.body, this.resources);
        this.mapRenderer = new mapView(document.body, "DejaVuSansMono", 18, -4, 11, this.map, this.resources);
        this.statusView = new story(document.body, this.resources, this.mapRenderer);
        endFunction = this.finishGame;
    }
    Game.prototype.update = function (timestamp) {
        if (this.finished) {
            return;
        }
        if (this.firstUpdate != null && fastMode) {
            var diff = timestamp - this.firstUpdate;
            var newDiff = timestamp * 4;
            timestamp = this.firstUpdate + newDiff;
        }
        if (timestamp - this.lastUpdate > 1000) {
            if (this.loadingPopup == null) {
                this.loadingPopup = new loadingView(document.body);
                return;
            }
            //alert("Catchup to 1 second");
            var tempLastUpdate = this.lastUpdate;
            while (timestamp - tempLastUpdate > 1000) {
                this.updateState(tempLastUpdate);
                tempLastUpdate += 50;
            }
            this.loadingPopup.destroyView();
            this.loadingPopup = null;
        }
        this.updateState(timestamp);
        this.updateViews();
        this.lastUpdate = timestamp;
        if (this.firstUpdate == null) {
            this.firstUpdate = timestamp;
        }
    };
    Game.prototype.updateState = function (timestamp) {
        this.resources.update(timestamp);
        this.map.update(timestamp);
    };
    Game.prototype.updateViews = function () {
        this.resourceView.update();
        this.mapRenderer.update();
    };
    return Game;
}());
var hellPathGraph = /** @class */ (function () {
    function hellPathGraph(map) {
        this.nodeDictionary = [];
        this.map = map;
    }
    hellPathGraph.prototype.addNode = function (x, y) {
        if (this.nodeDictionary[this.getKey(x, y)] == null) {
            var newNode = new node(x, y);
            //Add Node to dictionary
            this.nodeDictionary[this.getKey(x, y)] = newNode;
            //Set up links with neighbours
            var newNeighbours = this.getNewNeighbours(x, y);
            for (var i = 0; i < newNeighbours.length; i++) {
                newNeighbours[i].addNeighbour(newNode);
                newNode.addNeighbour(newNeighbours[i]);
            }
        }
    };
    //TODO Threw this together more haphazardly than the rest. The whole node graph approach needs refactoring big time stylee
    hellPathGraph.prototype.getNewNeighbours = function (x, y) {
        var newNeighbours = [];
        var allCoordinates = this.map.getNeighbourCoordinates(x, y);
        for (var i = 0; i < allCoordinates.length; i++) {
            var coords = allCoordinates[i];
            var candidate = this.nodeDictionary[this.getKey(coords[0], coords[1])];
            if (candidate != null) {
                newNeighbours.push(candidate);
            }
            else {
                alert("Found neighbour that doesn't have corresponding pathfinding node");
            }
        }
        return newNeighbours;
    };
    hellPathGraph.prototype.removeNode = function (x, y) {
        if (this.nodeDictionary[this.getKey(x, y)] != null) {
            var node = this.nodeDictionary[this.getKey(x, y)];
            //remove Node from dictionary
            delete this.nodeDictionary[this.getKey(x, y)];
            //Remove links with neighbours
            //Inwards
            var neighbours = node.getNeighbours();
            for (var i = 0; i < neighbours.length; i++) {
                neighbours[i].removeNeighbour(node);
            }
            //Outwards
            node.clearNeighbours();
        }
    };
    //TODO
    //Used to get start and end node for path finding
    hellPathGraph.prototype.getNode = function (x, y) {
        return this.nodeDictionary[this.getKey(x, y)];
    };
    hellPathGraph.prototype.getAllNodes = function () {
        var keys = Object.keys(this.nodeDictionary);
        var nodes = [];
        for (var i = 0; i < keys.length; i++) {
            nodes.push(this.nodeDictionary[keys[i]]);
        }
        return nodes;
    };
    hellPathGraph.prototype.getKey = function (x, y) {
        return x + "," + y;
    };
    return hellPathGraph;
}());
var loadingView = /** @class */ (function () {
    function loadingView(parent) {
        this.parent = null;
        this.div = null;
        this.parent = parent;
        this.createView();
    }
    loadingView.prototype.createView = function () {
        this.div = document.createElement("div");
        this.div.className = "overlay1";
        var loadingPopup = document.createElement("div");
        loadingPopup.className = "overlay2";
        var paragraph = document.createElement("p");
        paragraph.innerHTML = "Loading...";
        loadingPopup.appendChild(paragraph);
        this.parent.appendChild(this.div);
        this.div.appendChild(loadingPopup);
    };
    loadingView.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
    };
    return loadingView;
}());
var map = /** @class */ (function () {
    function map(resources) {
        this.height = 28;
        this.width = 50;
        this.tiles = [];
        this.buildings = [];
        this.actors = [];
        this.roads = [];
        this.pathFindingGraph = new hellPathGraph(this);
        this.labyrinths = 0;
        this.firstCrushersPlaced = 0;
        this.resources = resources;
        for (var x = 0; x < this.height; x++) {
            this.roads.push([]);
            for (var y = 0; y < this.width; y++) {
                this.roads[x].push(false);
            }
            this.tiles.push([]);
            for (var y = 0; y < this.width; y++) {
                this.tiles[x].push(" ");
            }
        }
        //TODO remove debug variables
        //var debugActor = new actor(this, this.pathFindingGraph);
        //debugActor.putAtOrigin();
        //this.actors.push(debugActor);
    }
    map.prototype.getTile = function (x, y) {
        return this.tiles[y][x];
    };
    map.prototype.getHeight = function () {
        return this.height;
    };
    map.prototype.getWidth = function () {
        return this.width;
    };
    map.prototype.getLabyrinths = function () {
        return this.labyrinths;
    };
    map.prototype.addBuilding = function (building) {
        if (this.firstCrushersPlaced < 3 && building instanceof crusher) {
            this.firstCrushersPlaced++;
            if (this.firstCrushersPlaced == 3) {
                showPainBuildingButton = true;
            }
        }
        if (building instanceof warper) {
            showPowerPlantButton = true;
        }
        if (building instanceof powerPlant) {
            showBigCrusherButton = true;
        }
        if (building instanceof bigCrusher) {
            showZigguratButton = true;
        }
        if (building instanceof warper) {
            var addingWarper = building;
            addingWarper.addAdjacentToBuildingsInRange(this.buildings);
            this.resources.addWarper();
        }
        else {
            for (var i = 0; i < this.buildings.length; i++) {
                if (this.buildings[i] instanceof warper) {
                    var tempWarper = this.buildings[i];
                    if (tempWarper.isBuildingInRange(building)) {
                        building.addAdjacentWarper();
                    }
                }
            }
        }
        if (building instanceof labyrinth1 ||
            building instanceof labyrinth2 ||
            building instanceof labyrinth3 ||
            building instanceof labyrinth4 ||
            building instanceof labyrinth5) {
            this.labyrinths += 1;
        }
        if (building instanceof ziggurat) {
            this.buildings.push(building);
        }
        else {
            this.buildings.unshift(building);
        }
    };
    map.prototype.getBuildingsCount = function (referenceBuilding) {
        var count = 0;
        for (var i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].constructor == referenceBuilding.constructor) {
                count++;
            }
        }
        return count;
    };
    map.prototype.getBuildings = function () {
        return this.buildings;
    };
    map.prototype.addActor = function (actor) {
        this.actors.push(actor);
    };
    map.prototype.getActors = function () {
        return this.actors;
    };
    map.prototype.removeActor = function (actor) {
        var index = -1;
        for (var i = 0; i < this.actors.length; i++) {
            if (this.actors[i] == actor) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.actors.splice(index, 1);
        }
    };
    map.prototype.killActor = function (toKill) {
        this.resources.returnActorResources(toKill);
        this.removeActor(toKill);
    };
    map.prototype.getBuildingOccupyingGridIndex = function (x, y) {
        for (var i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].getX() <= x && this.buildings[i].getX() + this.buildings[i].getWidth() > x &&
                this.buildings[i].getY() <= y && this.buildings[i].getY() + this.buildings[i].getHeight() > y) {
                return i;
            }
        }
        return null;
    };
    map.prototype.getActorOccupyingGridIndex = function (x, y) {
        for (var i = 0; i < this.actors.length; i++) {
            if (this.actors[i].getX() <= x + 0.5 && this.actors[i].getX() >= x - 0.5 &&
                this.actors[i].getY() <= y + 0.5 && this.actors[i].getY() >= y - 0.5) {
                return this.actors[i];
            }
        }
        return null;
    };
    map.prototype.setTile = function (x, y, character) {
        this.tiles[y][x] = character;
    };
    map.prototype.deleteBuilding = function (index) {
        if (index != null) {
            var building = this.buildings[index];
            var linkedBuildings = this.getLinkedDeleteBuildings(index);
            for (var i = this.actors.length - 1; i >= 0; i--) {
                if (this.actors[i].getDestination() == this.buildings[index]) {
                    this.killActor(this.actors[i]);
                }
                else if (this.actors[i] instanceof wanderingActor) {
                    var asWander = this.actors[i];
                    if (asWander.getHome() == this.buildings[index]) {
                        this.killActor(this.actors[i]);
                    }
                }
            }
            this.resources.returnBuildingResources(this.buildings[index]);
            this.buildings.splice(index, 1);
            if (building instanceof warper) {
                var deletingWarper = building;
                deletingWarper.removeAdjacentToBuildingsInRange(this.buildings);
                this.resources.removeWarper();
            }
            if (building instanceof labyrinth1 ||
                building instanceof labyrinth2 ||
                building instanceof labyrinth3 ||
                building instanceof labyrinth4 ||
                building instanceof labyrinth5) {
                this.labyrinths -= 1;
            }
            for (var y = 0; y < linkedBuildings.length; y++) {
                var linkedIndex = this.buildings.indexOf(linkedBuildings[y]);
                if (linkedIndex >= 0) { //If index is -1 building has already been deleted
                    this.deleteBuilding(linkedIndex);
                }
            }
            document.getElementById("flavour").innerHTML = "Tear it down. Tear it all down.";
            return building;
        }
    };
    map.prototype.getLinkedDeleteBuildings = function (index) {
        var output = [];
        var tempBuildings = this.buildings.slice();
        tempBuildings.splice(index, 1);
        for (var i = 0; i < tempBuildings.length; i++) {
            if (!tempBuildings[i].getMapRequirementsMet(tempBuildings, this.roads)) {
                output.push(tempBuildings[i]);
            }
        }
        return output;
    };
    map.prototype.getPathfindingGraph = function () {
        return this.pathFindingGraph;
    };
    map.prototype.setRoad = function (x, y, road) {
        this.roads[y][x] = road;
        if (road) {
            this.pathFindingGraph.addNode(x, y);
        }
        else {
            this.pathFindingGraph.removeNode(x, y);
            //TODO Recalculate pathfinding???
        }
    };
    map.prototype.getRoad = function (x, y) {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            return this.roads[y][x];
        }
        else {
            return false;
        }
    };
    map.prototype.getRoads = function () {
        return this.roads;
    };
    map.prototype.update = function (timestamp) {
        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].update(timestamp);
        }
        for (var i = 0; i < this.buildings.length; i++) {
            this.buildings[i].update(timestamp);
        }
        //TODO Get rid of this debug statement
        //debugAllSouls();
    };
    map.prototype.debugAllSouls = function () {
        var toDeleteSouls = 0;
        for (var i = 0; i < this.actors.length; i++) {
            toDeleteSouls += this.actors[i].getDeleteSouls();
        }
        for (var i = 0; i < this.buildings.length; i++) {
            toDeleteSouls += this.buildings[i].getDeleteSouls();
        }
        var allSouls = this.resources.getTotalSouls();
        var calculatedAllSouls = this.resources.getSoulWind() + toDeleteSouls + this.resources.getBonesCount();
        if (allSouls != calculatedAllSouls && allSouls != calculatedAllSouls + 1) {
            alert('Souls not equal');
        }
        console.log('souls equal');
    };
    map.prototype.spawnWanderer = function (home) {
        var adjacentRoads = this.getRoadAdjacentToBuildingCoordinates(home);
        if (adjacentRoads.length > 0) {
            var randSpawn = adjacentRoads[Math.floor(Math.random() * adjacentRoads.length)];
            var newActor = new wanderingActor(this, this.pathFindingGraph, home, randSpawn[0], randSpawn[1], home.getWandererDescription());
            this.addActor(newActor);
            return true;
        }
        return false;
    };
    map.prototype.requestActor = function (destination) {
        var closestProducer = this.findClosestProducerNotEmpty(destination);
        if (closestProducer == null) {
            return null;
        }
        var soulId = closestProducer.getSoul();
        if (soulId == null) {
            return null;
        }
        var newActor;
        if (destination instanceof oasis) {
            newActor = new soulActor(this, this.pathFindingGraph, soulId, "green");
        }
        else {
            newActor = new soulActor(this, this.pathFindingGraph, soulId);
        }
        this.addActor(newActor);
        newActor.spawnWithPathFromBuildingToBuilding(closestProducer, destination);
        if (destination instanceof oasis) {
            var asOasis = destination;
            asOasis.setPainPerKillOasis(newActor.getJourneyDistance());
        }
        return soulId;
    };
    map.prototype.requestActorMultiple = function (destination, numSouls) {
        var closestProducer = this.findClosestProducerNotEmpty(destination);
        if (closestProducer == null) {
            return null;
        }
        if (closestProducer.getOccupants().length >= numSouls) {
            var soulIds = [];
            for (var i = 0; i < numSouls; i++) {
                soulIds.push(closestProducer.getSoul());
            }
            var newActor = new multipleSoulActor(this, this.pathFindingGraph, soulIds);
            this.addActor(newActor);
            newActor.spawnWithPathFromBuildingToBuilding(closestProducer, destination);
            return soulIds;
        }
        else {
            return null;
        }
    };
    map.prototype.findClosestProducerNotEmpty = function (closestTo) {
        var pf = new pathfinder();
        var result = null;
        var pathLength;
        for (var i = 0; i < this.buildings.length; i++) {
            //if producer, calculate path,
            if (this.buildings[i] instanceof ghetto) {
                var producer = this.buildings[i];
                if (producer.getOccupantsCount() > 0) {
                    var path = pf.findPathBetweenBuildings(producer, closestTo, this.pathFindingGraph);
                    if (path != null && (pathLength == null || path.getLength() < pathLength)) {
                        result = this.buildings[i];
                        pathLength = path.getLength();
                    }
                }
            }
        }
        return result;
    };
    map.prototype.getNeighbourCoordinates = function (x, y) {
        var allCoordinates = [];
        var currentBuilding = null;
        var currentBuildingIndex = this.getBuildingOccupyingGridIndex(x, y);
        if (currentBuildingIndex != null) {
            currentBuilding = this.buildings[currentBuildingIndex];
        }
        if (currentBuilding == null) { //Adding nodes for road
            //Road check for road connections
            allCoordinates = allCoordinates.concat(this.getRoadAdjacentCoordinates(x, y));
            //Road checking for building connections
            //allCoordinates = allCoordinates.concat(this.getBuildingAdjacentCoordinates(x,y)); 
        }
        else { //Adding nodes for building
            //Building checking for road connections
            //var buildingEdgeCoordinates = currentBuilding.getEdgeCoordinates();
            //for(var i = 0 ; i < buildingEdgeCoordinates.length; i++){
            //	allCoordinates = allCoordinates.concat(this.getRoadAdjacentCoordinates(buildingEdgeCoordinates[i][0],buildingEdgeCoordinates[i][1]));
            //}			
            allCoordinates = allCoordinates.concat(this.getRoadAdjacentToBuildingCoordinates(currentBuilding));
        }
        return allCoordinates;
    };
    map.prototype.getRoadAdjacentToBuildingCoordinates = function (input) {
        var buildingEdgeCoordinates = input.getEdgeCoordinates();
        var output = [];
        for (var i = 0; i < buildingEdgeCoordinates.length; i++) {
            output = output.concat(this.getRoadAdjacentCoordinates(buildingEdgeCoordinates[i][0], buildingEdgeCoordinates[i][1]));
        }
        return output;
    };
    map.prototype.getRoadAdjacentCoordinates = function (x, y) {
        var coordinates = [];
        if (x - 1 >= 0 && this.roads[y][x - 1]) {
            coordinates.push([x - 1, y]);
        }
        if (x + 1 < this.width && this.roads[y][x + 1]) {
            coordinates.push([x + 1, y]);
        }
        if (y - 1 >= 0 && this.roads[y - 1][x]) {
            coordinates.push([x, y - 1]);
        }
        if (y + 1 < this.height && this.roads[y + 1][x]) {
            coordinates.push([x, y + 1]);
        }
        return coordinates;
    };
    /*private getBuildingEdgeCoordinates(building : building){
        let coordinates = [];
        
        for(var x = 0; x < building.getWidth(); x++){
            for(var y = 0; y < building.getHeight(); y++){
                if(x == 0 || y == 0 || x == building.getWidth() - 1 || y == building.getHeight() - 1){
                    coordinates.push([building.getX() + x, building.getY() + y]);
                }
            }
        }
        return coordinates;
    }*/
    /*public getBuildingsAdjacentTo(adjacentTo : building) : building[]{
        var output = [];
        
        for(var i = 0; i < this.buildings.length; i++){
            if(this.buildings[i].isAdjacentTo(adjacentTo)){
                output.push(this.buildings[i]);
            }
        }
        
        return output;
    }*/
    map.prototype.getBuildingAdjacentCoordinates = function (x, y) {
        var coordinates = [];
        var buildIndex;
        //TODO clean up this shite
        buildIndex = this.getBuildingOccupyingGridIndex(x - 1, y);
        if (buildIndex != null) {
            coordinates.push([this.buildings[buildIndex].getX(), this.buildings[buildIndex].getY()]);
        }
        buildIndex = this.getBuildingOccupyingGridIndex(x + 1, y);
        if (buildIndex != null) {
            coordinates.push([this.buildings[buildIndex].getX(), this.buildings[buildIndex].getY()]);
        }
        buildIndex = this.getBuildingOccupyingGridIndex(x, y - 1);
        if (buildIndex != null) {
            coordinates.push([this.buildings[buildIndex].getX(), this.buildings[buildIndex].getY()]);
        }
        buildIndex = this.getBuildingOccupyingGridIndex(x, y + 1);
        if (buildIndex != null) {
            coordinates.push([this.buildings[buildIndex].getX(), this.buildings[buildIndex].getY()]);
        }
        return coordinates;
    };
    return map;
}());
var mapView = /** @class */ (function () {
    function mapView(parent, font, fontSize, tileWidthAdjust, tileWidthOverride, map, resources) {
        this.tempBuild = null;
        this.deleting = false;
        this.roading = false;
        this.mouseOnCanvas = false;
        this.mouseDown = false;
        this.buildingMenu = null;
        this.debugPathfindingNodes = false;
        this.debugPathfindingDestination = false;
        this.settingPathfindingDest = false;
        this.drawnWarperButton = false;
        this.tilemapRenderer = null;
        this.transientRenderer = null;
        this.canvasDiv = null;
        this.parent = parent;
        this.map = map;
        this.tileWidth = tileWidthOverride;
        this.fontSize = fontSize;
        this.tilemapRenderer = new TilemapRenderer(map.getWidth(), map.getHeight(), font, fontSize, tileWidthOverride);
        this.transientRenderer = new TransientRenderer(map.getWidth(), map.getHeight(), font, fontSize, tileWidthOverride);
        this.resources = resources;
    }
    //TODO Check this
    //TODO Stop rendering to off screen canvas' (of which there will be 4 after this)
    mapView.prototype.destroyView = function () {
        this.parent.removeChild(this.canvasDiv);
        this.canvasDiv = null;
        this.parent.removeChild(this.buildingMenu);
        this.buildingMenu = null;
    };
    mapView.prototype.createView = function () {
        var _this = this;
        //Create Canvas		
        this.canvasDiv = document.createElement("div");
        this.canvasDiv.className = "canvasDiv";
        this.parent.appendChild(this.canvasDiv);
        var backgroundCanvas = this.tilemapRenderer.createCanvas();
        this.canvasDiv.appendChild(backgroundCanvas);
        var overlayCanvas = this.transientRenderer.createCanvas();
        overlayCanvas.className = "overlayCanvas";
        this.canvasDiv.appendChild(overlayCanvas);
        this.buildingMenu = document.createElement("div");
        this.buildingMenu.className = "buildingMenu";
        this.parent.appendChild(this.buildingMenu); //I prefer to append after it's created, but this helps keep this code (a bit) cleaner
        //this.parent.insertBefore(this.buildingMenu, this.parent.firstChild);
        var buttonList = document.createElement("ul");
        buttonList.className = "buildingMenuList";
        this.buildingMenu.appendChild(buttonList);
        this.createListHeader(buttonList, "Take Action");
        if (disableConcentrate) {
            this.createFakeListButton(buttonList, "Concentrate...", "concentrateCost");
        }
        else {
            this.createListButton(buttonList, "Concentrate...", "", function () { return _this.coalesceSoul(); });
        }
        if (showGhettoButton) {
            this.createListHeader(buttonList, "Utility");
            this.createListButton(buttonList, "Cancel", null, function () { return _this.cancel(); });
            if (!showCrusherButton) {
                this.createFakeListButton(buttonList, "Delete", "deleteCost");
            }
            else {
                this.createListButton(buttonList, "Delete", null, function () { return _this.setDeleting(); });
            }
            this.createListHeader(buttonList, "Roads");
            this.createListButton(buttonList, "Build Roads", null, function () { return _this.setRoading(); });
            this.createListHeader(buttonList, "Buildings");
            this.createListButton(buttonList, "Ghetto", "ghettoCost", function () { return _this.setTempBuilding(new ghetto(_this.map, _this.resources)); });
            this.setCostLabel(new ghetto(this.map, this.resources));
        }
        if (showCrusherButton) {
            this.createListButton(buttonList, "Crusher", "crusherCost", function () { return _this.setTempBuilding(new crusher(_this.map, _this.resources)); });
            this.setCostLabel(new crusher(this.map, this.resources));
        }
        if (showBigCrusherButton) {
            this.createListButton(buttonList, "Big Crusher", "bigCrusherCost", function () { return _this.setTempBuilding(new bigCrusher(_this.map, _this.resources)); });
            this.setCostLabel(new bigCrusher(this.map, this.resources));
        }
        if (showWarperButton) {
            this.createListButton(buttonList, "Warper", "warperCost", function () { return _this.setTempBuilding(new warper(_this.map)); });
            this.setCostLabel(new warper(this.map));
            this.drawnWarperButton = true;
        }
        if (showPowerPlantButton) {
            this.createListButton(buttonList, "Power Plant", "powerPlantCost", function () { return _this.setTempBuilding(new powerPlant(_this.map, _this.resources)); });
            this.setCostLabel(new powerPlant(this.map, this.resources));
        }
        var enableZigguratButton = false;
        //This will cause some great glitches unless it is refreshed whenever it is clicked
        if (showPainBuildingButton) {
            var progress = new painBuildingProgress();
            var info = progress.getNextPainBuilding(this.map, this.resources);
            this.createListHeader(buttonList, "SPECIAL: Punishment");
            if (info != null) {
                this.createListButton(buttonList, info[0], "painBuildingCost", function () { return _this.setTempBuilding(info[1]); });
                document.getElementById("painBuildingCost").innerHTML = "SPECIAL";
                document.getElementById("painBuildingCost").innerHTML = info[1].getNextBones() + " bones";
            }
            else {
                this.createFakeListButton(buttonList, "Inactive", "painBuildingCost");
                document.getElementById("painBuildingCost").innerHTML = "FINISHED";
                enableZigguratButton = true;
            }
        }
        if (showZigguratButton) {
            this.createListHeader(buttonList, "SPECIAL: Ritual");
            var temp = new ziggurat(this.map, this.resources);
            if (this.map.getBuildingsCount(temp) == 0 && (enableZigguratButton || satanMode)) {
                this.createListButton(buttonList, "Ziggurat", "zigguratBuildingCost", function () { return _this.setTempBuilding(new ziggurat(_this.map, _this.resources)); });
                this.setCostLabel(temp);
            }
            else {
                this.createFakeListButton(buttonList, "Ziggurat", "zigguratBuildingCost");
                if (enableZigguratButton || satanMode) {
                    document.getElementById("zigguratBuildingCost").innerHTML = "BUILT";
                }
                else {
                    this.setCostLabel(temp);
                }
            }
        }
        if (this.debugPathfindingDestination) {
            this.createListButton(buttonList, "Set Pathfinding Destination", null, function () { return _this.setPathfindingDestination(); });
        }
        this.mouseOnCanvas = false;
        this.transientRenderer.getCanvas().onmousemove = function (event) { return _this.mouseMoved(event); };
        this.transientRenderer.getCanvas().onmouseenter = function (event) { _this.mouseOnCanvas = true; };
        this.transientRenderer.getCanvas().onmouseleave = function (event) { _this.mouseOnCanvas = false; _this.mouseDown = false; };
        this.transientRenderer.getCanvas().onmousedown = function (event) { _this.mouseDown = true; };
        this.transientRenderer.getCanvas().onmouseup = function (event) { _this.mouseDown = false; };
        this.transientRenderer.getCanvas().onclick = function () { return _this.canvasClick(); };
    };
    mapView.prototype.setCostLabel = function (building) {
        var labelId = null;
        if (building instanceof ghetto) {
            labelId = "ghettoCost";
        }
        else if (building instanceof crusher) {
            labelId = "crusherCost";
        }
        else if (building instanceof warper) {
            labelId = "warperCost";
        }
        else if (building instanceof powerPlant) {
            labelId = "powerPlantCost";
        }
        else if (building instanceof bigCrusher) {
            labelId = "bigCrusherCost";
        }
        else if (building instanceof ziggurat) {
            labelId = "zigguratBuildingCost";
        }
        if (labelId != null) {
            document.getElementById(labelId).innerHTML = building.getNextBones() + " bones";
        }
    };
    mapView.prototype.createFakeListButton = function (buttonList, label, descId) {
        var buttonLi = document.createElement('li');
        var button = document.createElement("button");
        button.innerHTML = label;
        button.className = "listFakeButton";
        //var requiresLi = document.createElement('li');
        var description = document.createElement('span');
        description.innerHTML = "-";
        description.id = descId;
        description.className = "listDescription";
        buttonLi.appendChild(button);
        buttonLi.appendChild(description);
        buttonList.appendChild(buttonLi);
    };
    mapView.prototype.createListButton = function (buttonList, label, descId, effect) {
        var buttonLi = document.createElement('li');
        var button = document.createElement("button");
        button.innerHTML = label;
        button.onclick = effect;
        button.className = "listButton";
        //var requiresLi = document.createElement('li');
        var description = document.createElement('span');
        description.innerHTML = "-";
        description.id = descId;
        description.className = "listDescription";
        buttonLi.appendChild(button);
        buttonLi.appendChild(description);
        buttonList.appendChild(buttonLi);
        //requiresList.appendChild(requiresLi);
    };
    mapView.prototype.createListHeader = function (buttonList, headerString) {
        var buttonLi = document.createElement('li');
        buttonLi.className = "buildingMenuHeader";
        var header = document.createElement('span');
        header.innerHTML = headerString;
        buttonLi.appendChild(header);
        buttonList.appendChild(buttonLi);
    };
    mapView.prototype.mouseMoved = function (evt) {
        var rect = this.tilemapRenderer.getCanvas().getBoundingClientRect();
        this.mouseX = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * this.tilemapRenderer.getCanvas().width);
        this.mouseY = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * this.tilemapRenderer.getCanvas().height);
        var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
        var gridSquareY = Math.floor(this.mouseY / this.fontSize);
        if (this.mouseDown) {
            if (this.roading) {
                this.buildRoad(gridSquareX, gridSquareY);
            }
            if (this.deleting) {
                this.map.setRoad(gridSquareX, gridSquareY, false);
            }
        }
    };
    mapView.prototype.checkRedraw = function () {
        if (showWarperButton && !this.drawnWarperButton && this.buildingMenu != null) { //stupid hack to see if you're on the map screen or not
            return true;
        }
        else {
            return false;
        }
    };
    //TODO redraw such that there is no gap between removing the old view and making the new one
    //Remember, this function is so the buttons can be refreshed. Could also just factor out an "update buttons" function
    mapView.prototype.redraw = function () {
        this.destroyView();
        this.createView();
    };
    mapView.prototype.update = function () {
        if (this.checkRedraw()) {
            this.redraw();
        }
        this.renderAll();
    };
    mapView.prototype.renderAll = function () {
        if (this.canvasDiv != null) {
            this.tilemapRenderer.setAllNextTilesBlank();
            this.renderAllBuildings();
            this.renderAllRoads();
            this.renderAllActors();
            this.renderTempBuild();
            this.renderMouseSquare();
            //this.renderDebug();			
            this.tilemapRenderer.finishRendering();
            this.transientRenderer.finishRendering();
        }
    };
    mapView.prototype.renderAllActors = function () {
        var actors = this.map.getActors();
        for (var i = 0; i < actors.length; i++) {
            this.renderActor(actors[i]);
        }
    };
    mapView.prototype.renderActor = function (actor) {
        if (actor.getX() != null && actor.getY() != null) {
            if (actor instanceof multipleSoulActor) {
                this.transientRenderer.renderTile(actor.getX(), actor.getY(), "\u25A0", actor.getColour(), null, null);
            }
            else {
                this.transientRenderer.renderTile(actor.getX(), actor.getY(), "\u2666", actor.getColour(), null, null); //Very enjoyable that the diamond character ends in 666 in hex
            }
        }
    };
    /*public renderDebug(){
        if(this.debugPathfindingNodes){
            for(var x = 0; x < this.map.getWidth(); x++){
                for(var y = 0; y < this.map.getHeight(); y++){
                    var node = this.map.getPathfindingGraph().getNode(x, y);
                    if(node != null){
                        var neighbours = node.getNeighbours();
                        for(var i = 0; i < neighbours.length; i++){
                            super.renderPath(x,y,neighbours[i].getX(),neighbours[i].getY());
                        }
                        super.renderCircle(x,y);
                    }
                }
            }
        }
    }*/
    mapView.prototype.renderTempBuild = function () {
        if (this.tempBuild != null && this.mouseOnCanvas) {
            var gridSquareX = Math.floor((this.mouseX - (((this.tempBuild.getWidth() / 2) - 0.5) * this.tileWidth)) / this.tileWidth);
            var gridSquareY = Math.floor((this.mouseY - (((this.tempBuild.getHeight() / 2) - 0.5) * this.fontSize)) / this.fontSize);
            this.tempBuild.setX(gridSquareX);
            this.tempBuild.setY(gridSquareY);
            if (!this.resources.canSpendResources(this.tempBuild) || this.tempBuild.collidesAny(this.map.getBuildings()) || this.roadsInBuildingFootPrint(this.tempBuild) ||
                this.buildingOutOfBounds(this.tempBuild) || !this.tempBuild.getMapRequirementsMet(this.map.getBuildings(), this.map.getRoads())) {
                this.renderBuilding(this.tempBuild, 'black', 'red', true);
            }
            else {
                this.renderBuilding(this.tempBuild, 'white', 'black', true);
            }
        }
    };
    mapView.prototype.renderAllBuildings = function () {
        var builds = this.map.getBuildings();
        for (var i = 0; i < builds.length; i++) {
            this.renderBuilding(builds[i], 'black', 'white');
        }
        if (this.deleting) {
            var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
            var gridSquareY = Math.floor(this.mouseY / this.fontSize);
            var hoverOverBuilding = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
            if (hoverOverBuilding != null) {
                this.renderBuilding(this.map.getBuildings()[hoverOverBuilding], 'black', 'red', true);
                var linkedBuildings = this.map.getLinkedDeleteBuildings(hoverOverBuilding);
                for (var y = 0; y < linkedBuildings.length; y++) {
                    this.renderBuilding(linkedBuildings[y], 'black', 'red', true);
                }
            }
        }
    };
    mapView.prototype.renderMouseSquare = function () {
        if (this.mouseOnCanvas) {
            var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
            var gridSquareY = Math.floor(this.mouseY / this.fontSize);
            var hoverBuilding = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
            if (this.deleting) {
                if (hoverBuilding != null) {
                    return;
                }
                this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, ' ', 'white', 'red', null);
            }
            else if (this.roading) {
                if (hoverBuilding == null) {
                    this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'R', 'white', 'black', null);
                }
                else {
                    this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'R', 'white', 'red', null);
                }
            }
            else if (this.settingPathfindingDest) {
                this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'd', 'white', 'blue', null);
            }
            else if (hoverBuilding != null) {
                this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, '?', 'white', 'black', null);
            }
            else if (this.tempBuild == null) {
                var selectedActor = this.map.getActorOccupyingGridIndex(gridSquareX, gridSquareY);
                if (selectedActor != null) {
                    this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, '?', 'white', 'black', null);
                }
                else {
                    this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, ' ', 'white', 'black', null);
                }
            }
        }
    };
    mapView.prototype.renderBuilding = function (building, colour, background, temp) {
        if (temp === void 0) { temp = false; }
        var warped = false;
        if (!temp && (building.getAdjacentWarpers() > 0 || building instanceof warper)) {
            warped = true;
        }
        for (var x = 0; x < building.getWidth(); x++) {
            for (var y = 0; y < building.getHeight(); y++) {
                if (!warped) {
                    this.tilemapRenderer.renderTile(building.getX() + x, building.getY() + y, building.getTile(x, y), colour, background, null);
                }
                else {
                    this.tilemapRenderer.renderTile(building.getX() + x, building.getY() + y, building.getTile(x, y), colour, background, 'RoyalBlue');
                }
            }
        }
    };
    mapView.prototype.renderRoad = function (x, y) {
        if (this.map.getRoad(x, y)) {
            var north = this.map.getRoad(x, y - 1);
            var east = this.map.getRoad(x + 1, y);
            var south = this.map.getRoad(x, y + 1);
            var west = this.map.getRoad(x - 1, y);
            var tile;
            if (north && east && south && west) {
                tile = '\u256c';
            }
            else if (east && south && west) {
                tile = '\u2566';
            }
            else if (north && east && south) {
                tile = '\u2560';
            }
            else if (south && west && north) {
                tile = '\u2563';
            }
            else if (west && north && east) {
                tile = '\u2569';
            }
            else if (north && east) {
                tile = '\u255a';
            }
            else if (east && south) {
                tile = '\u2554';
            }
            else if (south && west) {
                tile = '\u2557';
            }
            else if (west && north) {
                tile = '\u255d';
            }
            else if (north && south) {
                tile = '\u2551';
            }
            else if (east && west) {
                tile = '\u2550';
            }
            else if (north) {
                tile = '\u2568';
            }
            else if (east) {
                tile = '\u255e';
            }
            else if (south) {
                tile = '\u2565';
            }
            else if (west) {
                tile = '\u2561';
            }
            else {
                //tile = '\u25A1';
                //tile = '\u25af';
                tile = '\u256c';
            }
            this.tilemapRenderer.renderTile(x, y, tile, 'black', 'white', null);
        }
    };
    mapView.prototype.renderAllRoads = function () {
        for (var x = 0; x < this.map.getWidth(); x++) {
            for (var y = 0; y < this.map.getHeight(); y++) {
                this.renderRoad(x, y);
            }
        }
    };
    mapView.prototype.cancel = function () {
        this.tempBuild = null;
        this.deleting = false;
        this.roading = false;
        this.settingPathfindingDest = false;
    };
    mapView.prototype.buildingOutOfBounds = function (build) {
        if (build.getX() < 0 ||
            build.getY() < 0 ||
            build.getX() + build.getWidth() > this.map.getWidth() ||
            build.getY() + build.getHeight() > this.map.getHeight()) {
            return true;
        }
        return false;
    };
    mapView.prototype.roadsInBuildingFootPrint = function (build) {
        for (var x = 0; x < build.getWidth(); x++) {
            for (var y = 0; y < build.getHeight(); y++) {
                if (this.map.getRoad(build.getX() + x, build.getY() + y)) {
                    return true;
                }
            }
        }
        return false;
    };
    mapView.prototype.canvasClick = function () {
        if (this.tempBuild != null && !this.tempBuild.collidesAny(this.map.getBuildings()) && !this.roadsInBuildingFootPrint(this.tempBuild) &&
            !this.buildingOutOfBounds(this.tempBuild) && this.tempBuild.getMapRequirementsMet(this.map.getBuildings(), this.map.getRoads())) {
            if (this.resources.canSpendResources(this.tempBuild)) {
                this.resources.spendResources(this.tempBuild);
                this.map.addBuilding(this.tempBuild);
                this.setCostLabel(this.tempBuild);
                this.tempBuild = null;
                document.getElementById("flavour").innerHTML = "By your hand alone, creation.";
                this.redraw();
            }
            else {
                document.getElementById("flavour").innerHTML = "You don't have enough resources to erect such a construction.";
            }
        }
        else if (this.tempBuild == null) {
            var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
            var gridSquareY = Math.floor(this.mouseY / this.fontSize);
            if (this.deleting) {
                var index = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
                if (index >= 0) {
                    var deleted = this.map.deleteBuilding(index);
                    this.setCostLabel(deleted);
                    this.redraw();
                }
                this.map.setRoad(gridSquareX, gridSquareY, false);
            }
            else if (this.roading) {
                this.buildRoad(gridSquareX, gridSquareY);
                document.getElementById("flavour").innerHTML = "Carve the barren ground. You sweat as you toil. Use roads to connect buildings";
            }
            else if (this.settingPathfindingDest) {
                var allActors = this.map.getActors();
                for (var i = 0; i < allActors.length; i++) {
                    allActors[i].setPathToDestination(gridSquareX, gridSquareY);
                }
                this.settingPathfindingDest = false;
            }
            else if (this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY) != null) {
                var index = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
                var newBuildingView = new buildingView(this.parent, this.map.getBuildings()[index], this);
                this.destroyView();
                newBuildingView.createView();
            }
            else {
                //TODO put this in a proper place
                var selectedActor = this.map.getActorOccupyingGridIndex(gridSquareX, gridSquareY);
                if (selectedActor != null && selectedActor instanceof soulActor) {
                    var selectedSoulActor = selectedActor;
                    this.destroyView();
                    var newSoul;
                    if (selectedActor.getDestination() instanceof oasis) {
                        newSoul = new soul(selectedSoulActor.getId(), "Here walks the soul of ", ", following nothing but the dreams of a clean oasis.");
                    }
                    else {
                        newSoul = new soul(selectedSoulActor.getId(), "Here walks the soul of ", ", chained and dragged along by a twisted, sinewy thing.");
                    }
                    var newSoulView = new soulView(this.parent, newSoul, null, null, this);
                }
                if (selectedActor != null && selectedActor instanceof multipleSoulActor) {
                    this.destroyView();
                    new simpleMessageView(this.parent, "A rusty bus struggles through the dust. Peering out the darkened windows are timid souls, lost and alone despite their company.", this);
                }
                if (selectedActor != null && selectedActor instanceof wanderingActor) {
                    this.destroyView();
                    var asWanderer = selectedActor;
                    new simpleMessageView(this.parent, asWanderer.getDescription(), this);
                }
            }
        }
    };
    mapView.prototype.coalesceSoul = function () {
        if (!(this.resources.getSoulWind() > 0)) {
            document.getElementById("flavour").innerHTML = "You concentrate, but nothing happens.";
        }
        else {
            this.resources.removeSoulWind();
            this.destroyView();
            new concentrateView(this.parent, this.resources, this);
        }
    };
    mapView.prototype.buildRoad = function (x, y) {
        if (this.map.getBuildingOccupyingGridIndex(x, y) == null) {
            this.map.setRoad(x, y, true);
        }
    };
    mapView.prototype.setTempBuilding = function (building) {
        this.cancel();
        this.tempBuild = building;
        if (building.getBuildingMessage() != null) {
            document.getElementById("flavour").innerHTML = "<b>" + building.getBuildingMessage() + "</b>";
        }
    };
    mapView.prototype.setDeleting = function () {
        this.cancel();
        this.deleting = true;
    };
    mapView.prototype.setRoading = function () {
        this.cancel();
        this.roading = true;
    };
    mapView.prototype.setPathfindingDestination = function () {
        this.cancel();
        this.settingPathfindingDest = true;
    };
    return mapView;
}());
var multipleSoulActor = /** @class */ (function (_super) {
    __extends(multipleSoulActor, _super);
    function multipleSoulActor(map, nodeGraph, soulIds) {
        var _this = _super.call(this, map, nodeGraph) || this;
        _this.soulIds = soulIds;
        return _this;
    }
    multipleSoulActor.prototype.getIds = function () {
        return this.soulIds;
    };
    multipleSoulActor.prototype.arrive = function () {
        if (this.destination instanceof consumer) {
            var dest = this.destination;
            for (var i = 0; i < this.soulIds.length; i++) {
                dest.arrive(this.soulIds[i]);
            }
        }
        this.map.removeActor(this);
    };
    multipleSoulActor.prototype.doNotArrive = function () {
        if (this.destination instanceof consumer) {
            var dest = this.destination;
            for (var i = 0; i < this.soulIds.length; i++) {
                dest.doNotArrive(this.soulIds[i]);
            }
        }
        this.map.killActor(this);
    };
    multipleSoulActor.prototype.getDeleteSouls = function () {
        return this.soulIds.length;
    };
    return multipleSoulActor;
}(actor));
var painBuildingProgress = /** @class */ (function () {
    function painBuildingProgress() {
        this.buildingProgression = [];
        this.buildingProgression.push([hangman, "Hangman's Hill"]);
        this.buildingProgression.push([cesspit, "Cesspit"]);
        this.buildingProgression.push([labyrinth1, "Labyrinth Gates"]);
        this.buildingProgression.push([solitude, "Lonely Throne"]);
        this.buildingProgression.push([oasis, "Oasis Mirage"]);
        this.buildingProgression.push([labyrinth2, "Extend Labyrinth"]);
        this.buildingProgression.push([gulag, "Gulag"]);
        this.buildingProgression.push([soulWell, "Well of Souls"]);
        this.buildingProgression.push([labyrinth3, "Extend Labyrinth"]);
        this.buildingProgression.push([cage, "The Cage"]);
        this.buildingProgression.push([labyrinth4, "Extend Labyrinth"]);
        this.buildingProgression.push([cessSwamp, "Cess-Swamp"]);
        this.buildingProgression.push([mall, "Abandoned Mall"]);
        this.buildingProgression.push([lightningRod, "Lightning Rod"]);
        this.buildingProgression.push([sisyphus, "A Boulder, A Hill"]);
        this.buildingProgression.push([labyrinth5, "Extend Labyrinth"]);
    }
    painBuildingProgress.prototype.getNextPainBuilding = function (map, resources) {
        var output = [];
        var buildingTypes = [];
        var mapBuildings = map.getBuildings();
        for (var i = 0; i < mapBuildings.length; i++) {
            if (!buildingTypes.includes(mapBuildings[i].constructor)) {
                buildingTypes.push(mapBuildings[i].constructor);
            }
        }
        var buildingProgressionIndex;
        for (var y = 0; y < this.buildingProgression.length; y++) {
            if (!buildingTypes.includes(this.buildingProgression[y][0])) {
                buildingProgressionIndex = y;
                break;
            }
        }
        if (buildingProgressionIndex != null) {
            var buttonString = this.buildingProgression[buildingProgressionIndex][1];
            var toBuild = new this.buildingProgression[buildingProgressionIndex][0](map, resources);
            output.push(buttonString);
            output.push(toBuild);
            return output;
        }
        else {
            return null;
        }
    };
    return painBuildingProgress;
}());
var resourceView = /** @class */ (function () {
    function resourceView(parent, resources) {
        this.parent = parent;
        this.resources = resources;
        this.div = document.createElement('div');
        this.div.className = "bar";
        this.soulsCount = document.createElement('div');
        parent.appendChild(this.div);
        this.div.appendChild(this.soulsCount);
    }
    resourceView.prototype.update = function () {
        if (this.resources.getTotalSouls() > 0) {
            var displayString = "Assemblage: " + this.resources.getTotalSouls()
                + "   |   The Eddy: " + this.resources.getSoulWind()
                + "   |   <b>Bones: " + this.resources.getBonesCount() + "</b>";
            if (this.resources.hasPowerBeenAboveZero()) {
                displayString +=
                    "   |   Fuel: " + this.resources.getPower();
            }
            if (this.resources.hasPainBeenAboveZero()) {
                displayString +=
                    "   |   Anguish: " + this.resources.getPain();
            }
            this.soulsCount.innerHTML = displayString;
        }
        else {
            this.soulsCount.innerHTML = "...";
        }
    };
    resourceView.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
    };
    return resourceView;
}());
var resources = /** @class */ (function () {
    function resources() {
        this.soulsPerSecond = 1.8; //Apparantly the average number of deaths per second is 1.8
        this.soulsToAdd = 0;
        this.totalSouls = 0;
        this.soulWind = 0;
        this.bonesCount = 0;
        this.power = 0;
        this.powerBeenAboveZero = false;
        this.pain = 0;
        this.painBeenAboveZero = false;
        this.nextSoulId = 0;
        //private map : map = null
        this.startedGame = false;
        this.warpers = 0;
    }
    resources.prototype.getTotalSouls = function () {
        return this.totalSouls;
    };
    resources.prototype.getSoulWind = function () {
        return this.soulWind;
    };
    resources.prototype.getBonesCount = function () {
        return this.bonesCount;
    };
    resources.prototype.getSoulsPerSecond = function () {
        return this.soulsPerSecond * (1 + (this.warpers * 2.5));
    };
    resources.prototype.update = function (timeStamp) {
        if (this.startedGame) {
            if (this.lastUpdate != null) {
                this.soulsToAdd += ((timeStamp - this.lastUpdate) / 1000) * this.getSoulsPerSecond();
            }
            if (this.soulsToAdd > 1) {
                this.soulsToAdd -= 1;
                this.totalSouls += 1;
                this.soulWind += 1;
            }
            if (this.bonesCount == 3) {
                if (!showGhettoButton) {
                    showGhettoButton = true;
                }
            }
            if (this.bonesCount == 4 && !disabledConcentrateAlready) {
                disableConcentrate = true;
                disabledConcentrateAlready = true;
            }
            if (this.bonesCount == 6) {
                showCrusherButton = true;
                showWarperButton = true;
            }
            this.lastUpdate = timeStamp;
        }
    };
    resources.prototype.removeSoulWind = function () {
        this.soulWind -= 1;
    };
    resources.prototype.soulWindToBody = function (amount) {
        if (this.soulWind >= amount) {
            this.soulWind -= amount;
            return amount;
        }
        else {
            return 0;
        }
    };
    resources.prototype.turnSoulToBones = function () {
        this.bonesCount++;
    };
    resources.prototype.turnSoulsToBones = function (num) {
        this.bonesCount += num;
    };
    resources.prototype.spendResources = function (building) {
        if (satanMode) {
            return true;
        }
        var bones = building.getNextBones();
        if (bones > this.bonesCount) {
            return false;
        }
        else {
            this.bonesCount -= bones;
            return true;
        }
    };
    resources.prototype.canSpendResources = function (building) {
        if (satanMode) {
            return true;
        }
        var bones = building.getNextBones();
        if (bones > this.bonesCount) {
            return false;
        }
        else {
            return true;
        }
    };
    resources.prototype.returnBuildingResources = function (building) {
        var buildingTotal = building.getDeleteSouls();
        var spentBones = building.getMostRecentBones();
        var occupants = buildingTotal - spentBones;
        var percentAsBones = 0.2;
        var asEddy = Math.ceil(spentBones * (1 - percentAsBones));
        var asBones = Math.floor(spentBones * percentAsBones);
        this.soulWind += occupants;
        this.soulWind += asEddy;
        this.bonesCount += asBones;
    };
    resources.prototype.returnActorResources = function (actor) {
        this.soulWind += actor.getDeleteSouls();
    };
    resources.prototype.returnSoul = function () {
        this.soulWind += 1;
    };
    resources.prototype.startGame = function () {
        this.totalSouls += 1;
        this.startedGame = true;
        if (satanMode) {
            this.totalSouls += 10;
            this.bonesCount += 10;
        }
    };
    resources.prototype.getNextSoulId = function () {
        var id = this.nextSoulId;
        this.nextSoulId += 1;
        return id;
    };
    resources.prototype.addWarper = function () {
        this.warpers += 1;
    };
    resources.prototype.removeWarper = function () {
        this.warpers -= 1;
    };
    resources.prototype.getWarpers = function () {
        return this.warpers;
    };
    resources.prototype.getPower = function () {
        return this.power;
    };
    resources.prototype.addPower = function (input) {
        this.powerBeenAboveZero = true;
        this.power += input;
    };
    resources.prototype.hasPowerBeenAboveZero = function () {
        return this.powerBeenAboveZero;
    };
    resources.prototype.spendPain = function (requested) {
        if (this.pain >= requested) {
            this.pain -= requested;
            return true;
        }
        return false;
    };
    resources.prototype.getPain = function () {
        return this.pain;
    };
    resources.prototype.addPain = function (input) {
        this.painBeenAboveZero = true;
        this.pain += input;
    };
    resources.prototype.canSpendPower = function (requested) {
        if (this.power >= requested) {
            return true;
        }
        else {
            return false;
        }
    };
    resources.prototype.spendPower = function (requested) {
        if (this.power >= requested) {
            this.power -= requested;
            return true;
        }
        return false;
    };
    resources.prototype.hasPainBeenAboveZero = function () {
        return this.painBeenAboveZero;
    };
    return resources;
}());
var simpleMessageView = /** @class */ (function () {
    function simpleMessageView(parent, message, mapView) {
        this.parent = null;
        this.div = null;
        this.mapView = null;
        this.parent = parent;
        this.message = message;
        this.mapView = mapView;
        this.createView();
    }
    simpleMessageView.prototype.createView = function () {
        var _this = this;
        this.div = document.createElement("div");
        var paragraph = document.createElement("p");
        paragraph.innerHTML = this.message;
        this.div.appendChild(paragraph);
        var options = document.createElement("ul");
        options.className = "horzMenu";
        var button2 = document.createElement("button");
        button2.innerHTML = "Return";
        button2.onclick = function () {
            _this.destroyView();
        };
        options.appendChild(button2);
        this.div.insertBefore(options, this.div.firstChild);
        this.parent.appendChild(this.div);
    };
    simpleMessageView.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
        this.mapView.createView();
    };
    return simpleMessageView;
}());
var soul = /** @class */ (function () {
    function soul(id, alternativeDescription1, alternativeDescription2) {
        if (alternativeDescription1 === void 0) { alternativeDescription1 = null; }
        if (alternativeDescription2 === void 0) { alternativeDescription2 = null; }
        this.randCount = 0;
        this.description = "";
        this.walking = false;
        this.id = id;
        this.initialiseSeed();
        this.generate();
        this.description = "Here stands the soul of " + this.name() + ".";
        if (alternativeDescription1 != null && alternativeDescription2 != null) {
            this.description = alternativeDescription1 + this.name() + alternativeDescription2;
            this.walking = true;
        }
    }
    soul.prototype.getWalking = function () {
        return this.walking;
    };
    soul.prototype.name = function () {
        return this.firstName + " " + this.lastName;
    };
    //Probably shouldn't be done here but whatevs
    soul.prototype.formattedDescription = function () {
        return "<p>" + this.description + "</p>" +
            "<p>" + this.fears + "</p>" +
            "<p><i>" + this.newThought() + "<br>" + this.newThought() + "</i></p>";
    };
    soul.prototype.generate = function () {
        //console.log("Generating new character");
        for (var i = 0; i < 20; i++) {
            this.seededRandom(); //Generate a bunch of randoms first to get away from the similar first values for similar seeds
        }
        this.gender = this.selectSeededRandomFrom(["Male", "Female"]);
        if (this.gender === "Male") {
            this.firstName = this.selectSeededRandomFrom(charGenData.maleFirstNames);
        }
        else {
            this.firstName = this.selectSeededRandomFrom(charGenData.femaleFirstNames);
        }
        if (this.seededRandom() < 0.07) {
            this.lastName = this.selectSeededRandomFrom(charGenData.lastNames) + "-" + this.selectSeededRandomFrom(charGenData.lastNames);
        }
        else {
            this.lastName = this.selectSeededRandomFrom(charGenData.lastNames);
        }
        this.fears = this.generateSentence(charGenData.fearPhrases, charGenData.fears) + " " + this.generateSentence(charGenData.fearPhrases, charGenData.fears);
    };
    soul.prototype.generateSentence = function (structures, contents) {
        var structure = this.selectSeededRandomFrom(structures);
        var content = this.selectSeededRandomFrom(contents);
        structure = structure.replace("&ins", content);
        if (this.gender === "Male") {
            structure = structure.replace("&pp", "His");
            structure = structure.replace("&np", "He");
            structure = structure.replace("&mp", "him");
            structure = structure.replace("&ncpp", "his");
        }
        else {
            structure = structure.replace("&pp", "Her");
            structure = structure.replace("&np", "She");
            structure = structure.replace("&mp", "her");
            structure = structure.replace("&ncpp", "her");
        }
        return structure;
    };
    soul.prototype.selectTrueRandomFrom = function (input) {
        return input[Math.floor(Math.random() * input.length)];
    };
    soul.prototype.selectSeededRandomFrom = function (input) {
        return input[Math.floor(this.seededRandom() * input.length)];
    };
    soul.prototype.getId = function () {
        return this.id;
    };
    soul.prototype.newThought = function () {
        return this.selectTrueRandomFrom(charGenData.generalThoughts);
    };
    soul.prototype.initialiseSeed = function () {
        var seed = this.id;
        this._seed = seed % 2147483647;
        if (this._seed <= 0)
            this._seed += 2147483646;
    };
    soul.prototype.seededRandom = function () {
        this._seed = this._seed * 16807 % 2147483647;
        var out = (this._seed - 1) / 2147483646;
        //console.log(out);
        return out;
    };
    return soul;
}());
var soulActor = /** @class */ (function (_super) {
    __extends(soulActor, _super);
    function soulActor(map, nodeGraph, soulId, colour) {
        if (colour === void 0) { colour = "red"; }
        var _this = _super.call(this, map, nodeGraph, colour) || this;
        _this.soulId = soulId;
        return _this;
    }
    soulActor.prototype.getId = function () {
        return this.soulId;
    };
    soulActor.prototype.arrive = function () {
        if (this.destination instanceof consumer) {
            var dest = this.destination;
            dest.arrive(this.soulId);
        }
        this.map.removeActor(this);
    };
    soulActor.prototype.doNotArrive = function () {
        if (this.destination instanceof consumer) {
            var dest = this.destination;
            dest.doNotArrive(this.soulId);
        }
        this.map.killActor(this);
    };
    soulActor.prototype.getDeleteSouls = function () {
        return 1;
    };
    return soulActor;
}(actor));
var soulView = /** @class */ (function () {
    function soulView(parent, soul, resources, buildingView, mapView) {
        this.div = null;
        this.soul = null;
        this.parent = null;
        this.buildingView = null;
        this.mapView = null;
        this.soul = soul;
        this.parent = parent;
        this.buildingView = buildingView;
        this.resources = resources;
        this.mapView = mapView;
        this.createView();
    }
    soulView.prototype.createView = function () {
        var _this = this;
        document.getElementById("flavour").innerHTML = "Someone appears before you.";
        this.div = document.createElement("div");
        this.div.innerHTML = this.soul.formattedDescription();
        var soulOptions = document.createElement("ul");
        soulOptions.className = "horzMenu";
        //Harvest
        if (this.resources != null && (this.buildingView == null || this.buildingView.getBuilding() instanceof ghetto)) {
            var button1 = document.createElement("button");
            button1.innerHTML = "Dismember";
            button1.onclick = function () {
                if (_this.buildingView != null && _this.buildingView.getBuilding() instanceof ghetto) {
                    var asGhetto = _this.buildingView.getBuilding();
                    var idRemoved = asGhetto.getSoulById(_this.soul.getId());
                    if (idRemoved == null) {
                        //alert('Did not remove soul you dismembered. What?');
                        _this.destroyView();
                        var simpleMessage = new simpleMessageView(_this.parent, "This soul has already moved on.", _this.mapView);
                        return;
                    }
                }
                if (disableConcentrate && _this.buildingView != null) {
                    disableConcentrate = false;
                }
                _this.resources.turnSoulToBones();
                _this.destroyView();
                //if(this.buildingView != null){
                //	this.buildingView.createView();
                //}
                //else{
                _this.mapView.createView();
                //}
                document.getElementById("flavour").innerHTML = "You rip through flesh as if it were jelly.";
            };
            soulOptions.appendChild(button1);
        }
        if (this.buildingView != null || (this.mapView != null && this.soul.getWalking())) {
            var button2 = document.createElement("button");
            button2.innerHTML = "Return";
            button2.onclick = function () {
                _this.destroyView();
                if (_this.buildingView == null) {
                    _this.mapView.createView();
                }
                else {
                    _this.buildingView.createView();
                }
            };
            soulOptions.appendChild(button2);
        }
        this.div.insertBefore(soulOptions, this.div.firstChild);
        this.parent.appendChild(this.div);
    };
    soulView.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
    };
    return soulView;
}());
var story = /** @class */ (function () {
    function story(parent, resources, mapView) {
        var _this = this;
        this.introState = 0;
        this.introTexts = [
            "Wake up...",
            "What is this place?",
            "A desolate wasteland. Vast crags on the horizon. The sky is torn asunder by cracks of silent lightning. Everything is grey."
        ];
        this.flavourState = 0;
        this.intro2Texts = [
            "A strange sensation...",
            "Something is rushing past...",
            "Screaming, weeping, choking, retching, convulsing, throbbing.",
            "Concentrate...",
            "Someone appears before you."
        ];
        this.parent = parent;
        this.resources = resources;
        this.mapView = mapView;
        this.div = document.createElement('div');
        this.div.className = "bar";
        this.intro = document.createElement('p');
        this.intro.className = "hoverable";
        this.nextIntro();
        this.intro.onclick = function () {
            _this.nextIntro();
        };
        this.flavour = document.createElement('p');
        this.flavour.className = "hoverable";
        this.flavour.id = "flavour";
        this.flavour.onclick = function () {
            _this.nextFlavour();
        };
        parent.appendChild(this.div);
        this.div.appendChild(this.intro);
        this.div.appendChild(document.createElement("hr"));
        this.div.appendChild(this.flavour);
        if (satanMode) {
            this.skipIntro();
        }
    }
    story.prototype.skipIntro = function () {
        this.resources.startGame();
        this.resources.turnSoulToBones();
        this.intro.className = "";
        this.flavour.className = "";
        this.introState = this.introTexts.length - 1;
        this.flavourState = 6;
        this.intro.innerHTML = this.introTexts[this.introState++];
        this.flavour.innerHTML = "Skipped Intro.";
        this.div.appendChild(document.createElement("hr"));
        this.mapView.createView();
    };
    story.prototype.nextIntro = function () {
        if (this.introState < this.introTexts.length) {
            this.intro.innerHTML = this.introTexts[this.introState++];
        }
        else if (this.flavourState === 0) {
            this.intro.className = "";
            this.nextFlavour();
            this.div.appendChild(document.createElement("hr"));
        }
    };
    story.prototype.nextFlavour = function () {
        if (this.flavourState < this.intro2Texts.length) {
            this.flavour.innerHTML = this.intro2Texts[this.flavourState++];
        }
        else if (this.flavourState === 5) {
            this.flavourState = 6;
            this.flavour.className = "";
            this.resources.startGame();
            new soulView(this.div.parentElement, new soul(this.resources.getNextSoulId()), this.resources, null, this.mapView);
        }
    };
    story.prototype.setFlavour = function (input) {
        this.flavour.innerHTML = input;
    };
    story.prototype.destroyView = function () {
        this.parent.removeChild(this.div);
        this.div = null;
    };
    return story;
}());
var wanderingActor = /** @class */ (function (_super) {
    __extends(wanderingActor, _super);
    function wanderingActor(map, nodeGraph, home, x, y, description, colour) {
        if (colour === void 0) { colour = "blue"; }
        var _this = _super.call(this, map, nodeGraph, colour) || this;
        _this.description = null;
        _this.home = null;
        _this.waitTimeMin = 2;
        _this.waitTimeMax = 10;
        _this.waitTime = 0;
        _this.timeWaited = 0;
        _this.dieChance = 0.1;
        _this.randDistance = 5;
        _this.description = description;
        _this.home = home;
        _this.x = x;
        _this.y = y;
        _this.arrive();
        return _this;
    }
    wanderingActor.prototype.arrive = function () {
        this.pathFollower = null;
        this.timeWaited = 0;
        this.waitTime = this.waitTimeMin + (Math.random() * (this.waitTimeMax - this.waitTimeMin));
    };
    wanderingActor.prototype.doNotArrive = function () {
        //Notify home that actor is dead
        this.home.removeWanderer();
        this.map.killActor(this);
    };
    wanderingActor.prototype.getDeleteSouls = function () {
        return 0;
    };
    wanderingActor.prototype.getDescription = function () {
        return this.description;
    };
    wanderingActor.prototype.makeDecision = function () {
        if (Math.random() < this.dieChance) {
            this.doNotArrive();
            return;
        }
        var currentNode = this.nodeGraph.getNode(Math.round(this.x), Math.round(this.y));
        if (currentNode == null) {
            this.doNotArrive();
            return;
        }
        //New Path Follower, generate path etc
        var nodes = this.nodeGraph.getAllNodes();
        var trimmedNodes = [];
        for (var i = 0; i < nodes.length; i++) {
            if (Math.abs(nodes[i].x - this.x) <= this.randDistance && Math.abs(nodes[i].y - this.y) <= this.randDistance) {
                trimmedNodes.push(nodes[i]);
            }
        }
        if (trimmedNodes.length > 0) {
            var randDestination = trimmedNodes[Math.floor(Math.random() * trimmedNodes.length)];
            var pf = new pathfinder();
            var path = pf.findPath(currentNode, randDestination);
            if (path != null) {
                this.pathFollower = new pathFollower();
                this.pathFollower.setPath(path);
            }
        }
    };
    wanderingActor.prototype.getHome = function () {
        return this.home;
    };
    wanderingActor.prototype.update = function (timestamp) {
        _super.prototype.update.call(this, timestamp);
        if (this.pathFollower == null && this.lastTimeStamp != null) {
            var timeDiff = (timestamp - this.lastTimeStamp) / 1000;
            this.timeWaited += timeDiff;
            if (this.timeWaited > this.waitTime) {
                this.makeDecision();
            }
        }
        this.lastTimeStamp = timestamp;
    };
    return wanderingActor;
}(actor));
var bigCrusher = /** @class */ (function (_super) {
    __extends(bigCrusher, _super);
    function bigCrusher(map, resources) {
        var _this = _super.call(this, map, resources, 10) || this;
        //Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
        _this.requestCoolDown = 2;
        _this.secondsSinceLastRequest = 0;
        _this.crushingTime = 5;
        _this.crushingTimeElapsed = 0;
        _this.busSize = _this.maxOccupants; //Same thing but in my tired state busSize is easier to comprehend. TODO maybe factor this out
        _this.width = 7;
        _this.height = 4;
        /*this.blueprint = [
            'MCRUSHM',
            '!CRUSH!',
            '!CRUSH!',
            '!CRUSH!'
        ];*/
        _this.blueprint = [
            '\u2588\u2588\u2588\u2588\u2588\u2501\u25CF',
            '\u2588\u2B1A\u2B1A\u2B1A\u2588  ',
            '\u2588\u2B1A\u2B1A\u2B1A\u2588\u263F ',
            '\u2588\u220F\u2588\u2588\u2588\u2501\u25EA'
        ];
        _this.blueprint = [
            '\u2591\u2591\u2591\u2591\u2591\u2591\u2591',
            '\u2591\u2592\u2359\u2359\u2359\u2592\u2591',
            '\u2591\u2592\u2359\u2359\u2359\u2592\u2591',
            '\u2591\u2591\u2591\u2591\u2591\u2591\u2591'
        ];
        _this.resources = resources;
        _this.description = "Rusting buses stop by with a monotonous rhythm. They drop off groups of people who enter the machine together, terrified and meek.";
        _this.buildingMessage = "Big Crushers use fuel to transport multiple souls at a time.";
        return _this;
    }
    bigCrusher.prototype.getCrushingTime = function () {
        return this.crushingTime * (1 / (1 + this.adjacentWarpers));
    };
    bigCrusher.prototype.getCostForXBuilt = function (x) {
        x = x - 1;
        return Math.floor(400 + (100 * x) + (2 * (Math.pow(x, 2))) + (0.2 * (Math.pow(x, 3))));
    };
    bigCrusher.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
            if (this.currentOccupants.length == this.busSize) {
                this.crushingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
                if (this.crushingTimeElapsed > this.getCrushingTime()) {
                    this.crushingTimeElapsed = 0;
                    this.resources.turnSoulsToBones(this.busSize);
                    this.currentOccupants.length = 0;
                }
            }
            else if (this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown && this.resources.canSpendPower(10)) {
                var soulIds = this.map.requestActorMultiple(this, this.busSize);
                if (soulIds != null) {
                    this.resources.spendPower(10);
                    for (var i = 0; i < soulIds.length; i++) {
                        this.addExpectedOccupant(soulIds[i]);
                    }
                }
                this.secondsSinceLastRequest = 0;
            }
        }
        this.lastUpdate = timestamp;
    };
    return bigCrusher;
}(consumer));
var cage = /** @class */ (function (_super) {
    __extends(cage, _super);
    function cage(map, resources) {
        var _this = _super.call(this, map, resources, 20, 10) || this;
        _this.width = 4;
        _this.height = 2;
        //\u25A5
        _this.blueprint = [
            ' \u25A5\u25A5 ',
            '\u2571\u25A5\u25A5\u2572'
        ];
        _this.description = "A giant prison made of bones.";
        _this.buildingMessage = "Requires 900 Bones. ";
        _this.maxWanderingChildren = 2;
        _this.wandererDescription = "The monster wanders near the Cage, mocking those who reside inside.";
        return _this;
    }
    cage.prototype.getCostForXBuilt = function (x) {
        return 900;
    };
    return cage;
}(painBuildingTorture));
var catacombs = /** @class */ (function (_super) {
    __extends(catacombs, _super);
    function catacombs(map, resources) {
        var _this = _super.call(this, map, resources, 12, 8) || this;
        _this.width = 4;
        _this.height = 4;
        //\u2500
        _this.blueprint = [
            '\u2592\u2592\u2592\u2592',
            '\u2592\u2592\u2592\u2592',
            '\u2592\u2592\u2592\u2592',
            '\u2592\u2592\u2592\u2592'
        ];
        _this.description = "The scrub on the surface of the ground here belies the mass of tunnels entwined snake like that run deep into the ground. There's no map for this place.";
        _this.buildingMessage = "Requires 1000 bones.";
        return _this;
    }
    catacombs.prototype.getCostForXBuilt = function (x) {
        return 1000;
    };
    return catacombs;
}(painBuildingTorture));
var cessSwamp = /** @class */ (function (_super) {
    __extends(cessSwamp, _super);
    function cessSwamp(map, resources) {
        var _this = _super.call(this, map, resources, 12, 35) || this;
        _this.width = 7;
        _this.height = 2;
        //\u2500
        _this.blueprint = [
            '\u219F   \u219F \u219F',
            '\u27C5\u2248\u2248\u27C6\u27C5\u2248\u27C6'
        ];
        _this.description = "The run-off from the bigger crushers lands in a large depression. Over time life has emerged, and now the area is a stinking acidic swamp.";
        _this.buildingMessage = "Requires 1200 Bones and 3 Big Crushers adjacent to the Cess Swamp.";
        _this.maxWanderingChildren = 3;
        _this.wandererDescription = "The monster wanders near the cess swamp. It longs to swim there, though it knows it is forbidden from doing so.";
        return _this;
    }
    cessSwamp.prototype.getMapRequirementsMet = function (buildings) {
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof bigCrusher) {
                crushersAdjacentTo++;
            }
        }
        if (crushersAdjacentTo >= 3) {
            return true;
        }
        return false;
    };
    cessSwamp.prototype.getCostForXBuilt = function (x) {
        return 1200;
    };
    return cessSwamp;
}(painBuildingTorture));
var cesspit = /** @class */ (function (_super) {
    __extends(cesspit, _super);
    function cesspit(map, resources) {
        var _this = _super.call(this, map, resources, 3, 1) || this;
        _this.width = 5;
        _this.height = 1;
        //\u2500
        _this.blueprint = [
            '\u27C5\u2248\u2248\u2248\u27C6'
        ];
        _this.description = "A pit filled with the run-off from the crushers. Souls struggle to stay afloat.";
        _this.buildingMessage = "Requires 100 Bones and 3 crushers adjacent to the cesspit.";
        _this.maxWanderingChildren = 1;
        _this.wandererDescription = "The monster wanders near the cesspit. It enjoys the stink.";
        return _this;
    }
    cesspit.prototype.getCostForXBuilt = function (x) {
        return 100;
    };
    cesspit.prototype.getMapRequirementsMet = function (buildings) {
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof crusher) {
                crushersAdjacentTo++;
            }
        }
        if (crushersAdjacentTo >= 3) {
            return true;
        }
        return false;
    };
    return cesspit;
}(painBuildingTorture));
var crusher = /** @class */ (function (_super) {
    __extends(crusher, _super);
    function crusher(map, resources) {
        var _this = _super.call(this, map, resources, 1) || this;
        //Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
        _this.requestCoolDown = 1;
        _this.secondsSinceLastRequest = 0;
        _this.crushingTime = 4;
        _this.crushingTimeElapsed = 0;
        _this.width = 5;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2588\u2588\u2588\u2501\u25CF',
            '\u2588\u2B1A\u2588\u263F ',
            '\u2588\u220F\u2588\u2501\u25EA'
        ];
        _this.blueprint = [
            '\u2591\u2591\u2591\u2591\u2591',
            '\u2591\u2592\u2359\u2592\u2591',
            '\u2591\u2591\u2591\u2591\u2591'
        ];
        /*this.blueprint = [
            '\u2E22   \u2E23',
            ' -\u0416- ',
            '\u2E24 \u25CF \u2E25'
        ];*/
        /*this.blueprint = [
            'CRUSH',
            'CRUSH',
            'CRUSH'
        ];*/
        _this.resources = resources;
        //this.map = map;
        _this.description = "A burnt humanoid thing operates a rudimentary machine which smashes rhythmically. People go in, bones comes out. A mountain of bones. A sluice pipe carries thick red giblets away.";
        return _this;
    }
    crusher.prototype.getCrushingTime = function () {
        return this.crushingTime * (1 / (1 + this.adjacentWarpers));
    };
    crusher.prototype.getCostForXBuilt = function (x) {
        x = x - 1;
        return Math.floor(10 + (5 * x) + (1.1 * (Math.pow(x, 2)) + (0.1 * (Math.pow(x, 3)))));
    };
    crusher.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
            if (this.currentOccupants.length == 1) {
                this.crushingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
                if (this.crushingTimeElapsed > this.getCrushingTime()) {
                    this.crushingTimeElapsed = 0;
                    this.resources.turnSoulToBones();
                    this.currentOccupants.splice(0, 1);
                }
            }
            else if (this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown) {
                this.addExpectedOccupant(this.map.requestActor(this));
                this.secondsSinceLastRequest = 0;
            }
        }
        this.lastUpdate = timestamp;
    };
    return crusher;
}(consumer));
var ghetto = /** @class */ (function (_super) {
    __extends(ghetto, _super);
    function ghetto(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.secondsSinceLastSoul = 0;
        _this.soulsToBodiesPerSecond = 2;
        _this.maxOccupants = 10;
        _this.currentOccupants = [];
        _this.width = 3;
        _this.height = 3;
        //\u2302
        _this.blueprint = [
            '\u2302\u2302\u2302',
            '\u2302\u2302\u2302',
            '\u2302\u2302\u2302'
        ];
        _this.resources = resources;
        _this.description = "A transient place for those without a home of their own. Tattered tents encircled by a ring of bones.";
        return _this;
    }
    ghetto.prototype.getResources = function () {
        return this.resources;
    };
    ghetto.prototype.getSoulsPerSecond = function () {
        return this.soulsToBodiesPerSecond * (1 + (this.adjacentWarpers / 2)) * (1 + (1 * this.resources.getWarpers()));
    };
    ghetto.prototype.getOccupantsCount = function () {
        return this.currentOccupants.length;
    };
    ghetto.prototype.getOccupants = function () {
        return this.currentOccupants;
    };
    ghetto.prototype.getSoul = function () {
        if (this.currentOccupants.length != 0) {
            var soulId = this.currentOccupants[0];
            this.currentOccupants.splice(0, 1);
            return soulId;
        }
        return null;
    };
    ghetto.prototype.getSoulById = function (id) {
        for (var i = 0; i < this.currentOccupants.length; i++) {
            if (this.currentOccupants[i] == id) {
                this.currentOccupants.splice(i, 1);
                return id;
            }
        }
        return null;
    };
    ghetto.prototype.getCostForXBuilt = function (x) {
        x = x - 1;
        return Math.floor(5 + (300 * x) + (5 * (Math.pow(x, 2))) + (1 * (Math.pow(x, 4))));
    };
    ghetto.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            if (this.currentOccupants.length < this.maxOccupants) {
                this.secondsSinceLastSoul += ((timestamp - this.lastUpdate) / 1000);
            }
        }
        if (this.secondsSinceLastSoul > (1 / this.getSoulsPerSecond())) {
            var soulsTransformed = this.resources.soulWindToBody(1);
            if (soulsTransformed > 0) {
                this.secondsSinceLastSoul = 0;
                this.currentOccupants.push(this.resources.getNextSoulId());
                //console.log(this.currentOccupants);
            }
        }
        this.lastUpdate = timestamp;
    };
    ghetto.prototype.getDeleteSouls = function () {
        return this.getMostRecentBones() + this.currentOccupants.length;
    };
    return ghetto;
}(building));
var gulag = /** @class */ (function (_super) {
    __extends(gulag, _super);
    function gulag(map, resources) {
        var _this = _super.call(this, map, resources) || this;
        _this.width = 4;
        _this.height = 7;
        //\u2302
        _this.blueprint = [
            '\u2302\u0245\u2591\u2302',
            '\u2302\u0245\u2591\u2302',
            '\u2302\u0245\u2591\u2302',
            '\u2302\u0245\u2591\u2302',
            '\u2302\u2591\u2591\u2302',
            '\u2302\u2591\u0245\u2302',
            '\u2302\u2591\u0245\u2302'
        ];
        _this.soulsToBodiesPerSecond = 4;
        _this.maxOccupants = 20;
        _this.description = "A massive shanty town. Souls are emaciated, worked to death. And yet somehow there are still always more.";
        _this.buildingMessage = "Requires 600 Bones. Acts like a ghetto.";
        return _this;
    }
    gulag.prototype.getCostForXBuilt = function (x) {
        return 600;
    };
    return gulag;
}(ghetto));
var hangman = /** @class */ (function (_super) {
    __extends(hangman, _super);
    function hangman(map, resources) {
        var _this = _super.call(this, map, resources, 10, 50) || this;
        _this.width = 2;
        _this.height = 2;
        //\u2500
        _this.blueprint = [
            '\uA712\uA712',
            '\uA712\uA712'
        ];
        _this.description = "A cluster of gallows atop a dumpy hillock.";
        _this.buildingMessage = "Requires 50 Bones.";
        _this.maxWanderingChildren = 1;
        _this.wandererDescription = "The monster wanders near the gallows, relishing in the pain of the annihilated.";
        return _this;
    }
    hangman.prototype.getCostForXBuilt = function (x) {
        return 50;
    };
    return hangman;
}(painBuildingKill));
var labyrinth1 = /** @class */ (function (_super) {
    __extends(labyrinth1, _super);
    function labyrinth1(map, resources) {
        var _this = _super.call(this, map, resources, 1, 15) || this;
        _this.width = 3;
        _this.height = 2;
        //\u2500
        _this.blueprint = [
            '\u2533\u250A\u2533',
            '\u2523\u2513\u2503'
        ];
        _this.description = "The entrance to the labyrinth. Large stone pillars quickly fade into blackness. Screams can be heard from within";
        _this.buildingMessage = "Requires 200 Bones.";
        _this.maxWanderingChildren = 2;
        _this.wandererDescription = "The monster wanders near the Labyrinth. Though it is afraid to venture inside, it is nourished by the screams that inexplicably reach the surface.";
        return _this;
    }
    labyrinth1.prototype.getCostForXBuilt = function (x) {
        return 200;
    };
    labyrinth1.prototype.getPainPerSoulPerSecond = function () {
        return this.painPerSoulPerSecond * (1 + (0.1 * this.adjacentWarpers)) * this.map.getLabyrinths();
    };
    return labyrinth1;
}(painBuildingTorture));
var labyrinth2 = /** @class */ (function (_super) {
    __extends(labyrinth2, _super);
    function labyrinth2(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.width = 3;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2503\u250F\u2503',
            '\u251B\u2501\u252B',
            '\u253B\u2501\u251B',
        ];
        _this.description = "Screams can be heard from within. Make sure to bring a ball of string.";
        _this.buildingMessage = "Requires 500 Bones and adjacent labyrinth piece. ";
        return _this;
    }
    labyrinth2.prototype.getMapRequirementsMet = function (buildings) {
        for (var y = 0; y < buildings.length; y++) {
            if (buildings[y] instanceof labyrinth1) {
                break;
            }
            if (y == buildings.length - 1) {
                return false;
            }
        }
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof labyrinth1 ||
                allAdjacent[i] instanceof labyrinth2 ||
                allAdjacent[i] instanceof labyrinth3 ||
                allAdjacent[i] instanceof labyrinth4 ||
                allAdjacent[i] instanceof labyrinth5) {
                return true;
            }
        }
        return false;
    };
    labyrinth2.prototype.getCostForXBuilt = function (x) {
        return 500;
    };
    return labyrinth2;
}(building));
var labyrinth3 = /** @class */ (function (_super) {
    __extends(labyrinth3, _super);
    function labyrinth3(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.width = 3;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2503\u2503\u2517',
            '\u2503\u2501\u2533',
            '\u2523\u2503\u2513',
        ];
        _this.description = "Screams can be heard from within. Make sure to bring a ball of string.";
        _this.buildingMessage = "Requires 800 Bones and adjacent labyrinth piece. ";
        return _this;
    }
    labyrinth3.prototype.getMapRequirementsMet = function (buildings) {
        for (var y = 0; y < buildings.length; y++) {
            if (buildings[y] instanceof labyrinth1) {
                break;
            }
            if (y == buildings.length - 1) {
                return false;
            }
        }
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof labyrinth1 ||
                allAdjacent[i] instanceof labyrinth2 ||
                allAdjacent[i] instanceof labyrinth3 ||
                allAdjacent[i] instanceof labyrinth4 ||
                allAdjacent[i] instanceof labyrinth5) {
                return true;
            }
        }
        return false;
    };
    labyrinth3.prototype.getCostForXBuilt = function (x) {
        return 800;
    };
    return labyrinth3;
}(building));
var labyrinth4 = /** @class */ (function (_super) {
    __extends(labyrinth4, _super);
    function labyrinth4(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.width = 3;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2501\u2533\u2513',
            '\u2501\u2503\u2503',
            '\u2517\u2503\u2503',
        ];
        _this.description = "Screams can be heard from within. Make sure to bring a ball of string.";
        _this.buildingMessage = "Requires 1000 Bones and adjacent labyrinth piece. ";
        return _this;
    }
    labyrinth4.prototype.getMapRequirementsMet = function (buildings) {
        for (var y = 0; y < buildings.length; y++) {
            if (buildings[y] instanceof labyrinth1) {
                break;
            }
            if (y == buildings.length - 1) {
                return false;
            }
        }
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof labyrinth1 ||
                allAdjacent[i] instanceof labyrinth2 ||
                allAdjacent[i] instanceof labyrinth3 ||
                allAdjacent[i] instanceof labyrinth4 ||
                allAdjacent[i] instanceof labyrinth5) {
                return true;
            }
        }
        return false;
    };
    labyrinth4.prototype.getCostForXBuilt = function (x) {
        return 1000;
    };
    return labyrinth4;
}(building));
var labyrinth5 = /** @class */ (function (_super) {
    __extends(labyrinth5, _super);
    function labyrinth5(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.width = 3;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2523\u2533\u251B',
            '\u2503\u2517\u251B',
            '\u2517\u2501\u2501',
        ];
        _this.description = "Screams can be heard from within. Make sure to bring a ball of string.";
        _this.buildingMessage = "Requires 2000 Bones and adjacent labyrinth piece. ";
        return _this;
    }
    labyrinth5.prototype.getMapRequirementsMet = function (buildings) {
        for (var y = 0; y < buildings.length; y++) {
            if (buildings[y] instanceof labyrinth1) {
                break;
            }
            if (y == buildings.length - 1) {
                return false;
            }
        }
        var allAdjacent = this.getAllAdjacentTo(buildings);
        var crushersAdjacentTo = 0;
        for (var i = 0; i < allAdjacent.length; i++) {
            if (allAdjacent[i] instanceof labyrinth1 ||
                allAdjacent[i] instanceof labyrinth2 ||
                allAdjacent[i] instanceof labyrinth3 ||
                allAdjacent[i] instanceof labyrinth4 ||
                allAdjacent[i] instanceof labyrinth5) {
                return true;
            }
        }
        return false;
    };
    labyrinth5.prototype.getCostForXBuilt = function (x) {
        return 2000;
    };
    return labyrinth5;
}(building));
var lightningRod = /** @class */ (function (_super) {
    __extends(lightningRod, _super);
    function lightningRod(map, resources) {
        var _this = _super.call(this, map, resources, 10, 700) || this;
        _this.width = 3;
        _this.height = 3;
        //\u2500
        _this.blueprint = [
            '\u2593\u2593\u2593',
            '\u2593I\u2593',
            '\u2593\u2593\u2593'
        ];
        _this.description = "When you can taste the static in the air, all you need to do is stick a metal pole in the ground and strap something on that you want to cook.";
        _this.buildingMessage = "Requires 1600 Bones and 2 Power Plants. ";
        _this.maxWanderingChildren = 3;
        _this.wandererDescription = "The monster wanders near the lightning rod. The smell of burnt flesh makes it hungry.";
        return _this;
    }
    lightningRod.prototype.getMapRequirementsMet = function (buildings) {
        var warpersExist = 0;
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i] instanceof powerPlant) {
                warpersExist += 1;
            }
        }
        if (warpersExist >= 2) {
            return true;
        }
        return false;
    };
    lightningRod.prototype.getCostForXBuilt = function (x) {
        return 1600;
    };
    return lightningRod;
}(painBuildingKill));
var mall = /** @class */ (function (_super) {
    __extends(mall, _super);
    function mall(map, resources) {
        var _this = _super.call(this, map, resources, 100, 10) || this;
        _this.width = 7;
        _this.height = 4;
        //\u2500
        _this.blueprint = [
            '\u256D\u2500\u2500\u2500\u2617\u2617\u2617',
            '\u2502   \u2617\u2617\u2617',
            '\u2502   \u2617\u2617\u2617',
            '\u2691 \u2691\u2500\u2617\u2617\u2617'
        ];
        _this.description = "An abandoned mall. Is there a more hellish place?";
        _this.buildingMessage = "Requires 1400 Bones and road connected to the mall's south side.";
        _this.maxWanderingChildren = 3;
        _this.wandererDescription = "The monster wanders near the abandoned mall, wary. The monster has never seen the mall before; it doesn't know what to make of it.";
        return _this;
    }
    mall.prototype.getMapRequirementsMet = function (buildings, roads) {
        var roadY = this.getY() + this.getHeight();
        for (var roadX = this.getX(); roadX < this.getX() + this.width; roadX++) {
            if (roadX >= 0 && roadX < this.map.getWidth() && roadY >= 0 && roadY < this.map.getHeight() && roads[roadY][roadX]) {
                return true;
            }
        }
        return false;
    };
    mall.prototype.getCostForXBuilt = function (x) {
        return 1400;
    };
    return mall;
}(painBuildingTorture));
var oasis = /** @class */ (function (_super) {
    __extends(oasis, _super);
    function oasis(map, resources) {
        var _this = _super.call(this, map, resources, 10, 0) || this;
        _this.oasisPain = 0;
        _this.width = 4;
        _this.height = 4;
        //\u2500
        _this.blueprint = [
            '\u2591\u219F\u2591\u2591',
            '\u2591\u2248\u2248\u2591',
            '\u219F\u2248\u2248\u219F',
            '\u2591\u2591\u2591\u219F'
        ];
        _this.description = "Something new on this blasted plain. Green, and blue, and hope. But look closer. It was just an illusion.";
        _this.buildingMessage = "Requires 400 Bones. Anguish generated increases with distance hopeful soul walks.";
        _this.maxWanderingChildren = 2;
        _this.wandererDescription = "The monster hides near the path to the oasis. It delights in seeing the hopeful souls as they pass, happy in the knowledge that soon their hopes will be crushed...";
        return _this;
    }
    oasis.prototype.getPainPerKill = function () {
        return this.oasisPain;
    };
    oasis.prototype.setPainPerKillOasis = function (distance) {
        this.oasisPain = distance * 10;
    };
    oasis.prototype.getCostForXBuilt = function (x) {
        return 400;
    };
    return oasis;
}(painBuildingKill));
var powerPlant = /** @class */ (function (_super) {
    __extends(powerPlant, _super);
    function powerPlant(map, resources) {
        var _this = _super.call(this, map, resources, 50) || this;
        _this.requestSoulCoolDown = 1;
        _this.requestCooledFor = 0;
        _this.bakingTime = 20;
        _this.bakedFor = 0;
        _this.timeToBoilPerSoul = 50 / 60;
        _this.boiledFor = 0;
        _this.bakingBoiling = false;
        _this.powerPerSoul = 15;
        _this.resources = resources;
        _this.width = 16;
        _this.height = 7;
        _this.blueprint = [
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
            '                ',
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2617\u2617',
            '\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2617\u2617'
        ];
        _this.description = "A sea of bodies pummeled into the ground, crushed by their own weight and turned into something like diamonds or coal. Soul coal... Then it's used to stoke the fire, turning giant turbines.";
        return _this;
    }
    powerPlant.prototype.getTimeToBoilPerSoul = function () {
        return this.timeToBoilPerSoul; //TODO warper affects this
    };
    powerPlant.prototype.getBakingTime = function () {
        return this.bakingTime; //TODO warper affects this
    };
    powerPlant.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            var elapsed = ((timestamp - this.lastUpdate) / 1000);
            if (this.currentOccupants.length + this.expectedOccupants.length < this.maxOccupants && !this.bakingBoiling) {
                if (this.requestCooledFor >= this.requestSoulCoolDown) {
                    //Call for new soul
                    this.addExpectedOccupant(this.map.requestActor(this));
                    this.requestCooledFor -= this.requestSoulCoolDown;
                }
                else {
                    //Bump cooldown
                    this.requestCooledFor += elapsed;
                }
            }
            else if (this.currentOccupants.length < this.maxOccupants && !this.bakingBoiling) {
                //do nothing pretty much
            }
            else if (!this.bakingBoiling) {
                this.bakingBoiling = true;
            }
            else if (this.bakedFor < this.getBakingTime()) {
                this.bakedFor += elapsed;
            }
            else if (this.currentOccupants.length > 0) {
                if (this.boiledFor > this.getTimeToBoilPerSoul()) {
                    this.boiledFor -= this.getTimeToBoilPerSoul();
                    //Add Power
                    this.resources.addPower(this.powerPerSoul);
                    //Return Soul
                    this.currentOccupants.splice(0, 1);
                    this.resources.returnSoul();
                }
                else {
                    this.boiledFor += elapsed;
                }
            }
            else {
                //Refresh everything
                this.requestCooledFor = 0;
                this.bakedFor = 0;
                this.boiledFor = 0;
                this.bakingBoiling = false;
                this.currentOccupants.length = 0;
            }
        }
        this.lastUpdate = timestamp;
    };
    powerPlant.prototype.getCostForXBuilt = function (x) {
        x = x - 1;
        var cost = Math.floor(500 + (600 * x));
        return cost;
    };
    return powerPlant;
}(consumer));
var sisyphus = /** @class */ (function (_super) {
    __extends(sisyphus, _super);
    function sisyphus(map, resources) {
        var _this = _super.call(this, map, resources, 1, 50) || this;
        _this.width = 5;
        _this.height = 2;
        //\u2500
        _this.blueprint = [
            '  \u2571\u2572 ',
            '\u25CE\u2571  \u2572'
        ];
        _this.description = "Salvation from the wastelands awaits the soul who can push a boulder to the top of this hill. A momentary lapse of concentration, and somehow they are right back at the bottom.";
        _this.buildingMessage = "Requires 1800 Bones and 4 Warpers. ";
        _this.maxWanderingChildren = 4;
        _this.wandererDescription = "The monster wanders near the eternal hill. The punishment is old, and is what passes for famous down here.";
        return _this;
    }
    sisyphus.prototype.getMapRequirementsMet = function (buildings) {
        var warpersExist = 0;
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i] instanceof warper) {
                warpersExist += 1;
            }
        }
        if (warpersExist >= 4) {
            return true;
        }
        return false;
    };
    sisyphus.prototype.getCostForXBuilt = function (x) {
        return 1800;
    };
    return sisyphus;
}(painBuildingTorture));
var solitude = /** @class */ (function (_super) {
    __extends(solitude, _super);
    function solitude(map, resources) {
        var _this = _super.call(this, map, resources, 1, 35) || this;
        _this.width = 7;
        _this.height = 7;
        //\u2500
        _this.blueprint = [
            '       ',
            '       ',
            '       ',
            '   \u265B   ',
            '       ',
            '       ',
            '       '
        ];
        _this.description = "A lonely throne. Civilization might not be far away, but a fog lingers, and through it nothing can be seen. The throne could be the only thing in the universe. Whoever sits here had to leave the road miles behind";
        _this.buildingMessage = "Requires 300 Bones.";
        _this.maxWanderingChildren = 2;
        _this.wandererDescription = "The monster tries to find the Lonely Throne. It never will.";
        return _this;
    }
    solitude.prototype.getCostForXBuilt = function (x) {
        return 300;
    };
    return solitude;
}(painBuildingTorture));
var soulWell = /** @class */ (function (_super) {
    __extends(soulWell, _super);
    function soulWell(map) {
        var _this = _super.call(this, map) || this;
        _this.width = 5;
        _this.height = 5;
        //\u2500
        _this.blueprint = [
            '\u256D\u2500\u2500\u2500\u256E',
            '\u2502\u224B\u224B\u224B\u2502',
            '\u2502\u224B\u224B\u224B\u2502',
            '\u2502\u224B\u224B\u224B\u2502',
            '\u2570\u2500\u2500\u2500\u256F'
        ];
        _this.description = "The Eddy given physical form. A smooth bore-hole filled to the brim with swirling, liquid souls.";
        _this.buildingMessage = "Requires 700 Bones. Non-functional.";
        return _this;
    }
    soulWell.prototype.getCostForXBuilt = function (x) {
        return 700;
    };
    return soulWell;
}(building));
var warper = /** @class */ (function (_super) {
    __extends(warper, _super);
    function warper(map) {
        var _this = _super.call(this, map) || this;
        _this.warpRadius = 2;
        _this.width = 4;
        _this.height = 4;
        //\u2500
        _this.blueprint = [
            '\u06F3\u0623\u0E96\u06F3',
            '\u0E96\u212B\u10DA\u0623',
            '\u0623\u10DA\u212B\u0E96',
            '\u06F3\u0E96\u0623\u06F3'
        ];
        _this.description = "A collection of strange monuments to the sky. The area glows with an eerie blue energy. Things nearby move with a strange halting motion, jumping from one place to the next. The Eddy is screaming louder than before.";
        return _this;
    }
    warper.prototype.isBuildingInRange = function (other) {
        //If other max x is below this min x
        if (other.getX() + other.getWidth() - 1 < this.getX() - this.warpRadius)
            return false;
        //If other min x is above this max x
        if (other.getX() > this.getX() + this.getWidth() - 1 + this.warpRadius)
            return false;
        //If other max Y is below this min Y
        if (other.getY() + other.getHeight() - 1 < this.getY() - this.warpRadius)
            return false;
        //If other min Y is above this max Y
        if (other.getY() > this.getY() + this.getHeight() - 1 + this.warpRadius)
            return false;
        return true;
    };
    warper.prototype.getCostForXBuilt = function (x) {
        x = x - 1;
        return Math.floor(50 + (100 * x) + (2 * (Math.pow(x, 2))) + (1 * (Math.pow(x, 3))) + (0.5 * (Math.pow(x, 4))));
    };
    warper.prototype.addAdjacentToBuildingsInRange = function (allBuildings) {
        var buildingsInRange = this.getBuildingsInRange(allBuildings);
        for (var i = 0; i < buildingsInRange.length; i++) {
            buildingsInRange[i].addAdjacentWarper();
        }
    };
    warper.prototype.removeAdjacentToBuildingsInRange = function (allBuildings) {
        var buildingsInRange = this.getBuildingsInRange(allBuildings);
        for (var i = 0; i < buildingsInRange.length; i++) {
            buildingsInRange[i].removeAdjacentWarper();
        }
    };
    warper.prototype.getBuildingsInRange = function (allBuildings) {
        var buildingsInRange = [];
        for (var i = 0; i < allBuildings.length; i++) {
            if (this.isBuildingInRange(allBuildings[i])) {
                buildingsInRange.push(allBuildings[i]);
            }
        }
        return buildingsInRange;
    };
    return warper;
}(building));
var ziggurat = /** @class */ (function (_super) {
    __extends(ziggurat, _super);
    function ziggurat(map, resources) {
        var _this = _super.call(this, map) || this;
        _this.secondsSinceLastSoul = 0;
        _this.soulsConsumedPerSecond = 80;
        _this.targetSouls = 50000; //10 million?
        _this.currentSouls = 0;
        _this.anguishRequired = 1500000; //10 million?
        _this.width = 5;
        _this.height = 5;
        _this.resources = resources;
        //\u2503
        // \u9820
        _this.blueprint = [
            '\u265C\u2501\u2501\u2501\u265C',
            '\u2503\u265C\u2501\u265C\u2503',
            '\u2503\u2503\u265C\u2503\u2503',
            '\u2503\u265C\u2501\u265C\u2503',
            '\u265C\u2501\u2501\u2501\u265C'
        ];
        _this.description = "A grey ziggurat. Squatly proportioned, and yet still it towers above the meager 'town' around it.";
        return _this;
    }
    //TODO, Do I want it to be affected by warpers? Consider more.
    //If not I need to get rid of the blue glow for this building
    ziggurat.prototype.getSoulsPerSecond = function () {
        return this.soulsConsumedPerSecond;
        //return this.soulsConsumedPerSecond * (1 + (this.adjacentWarpers / 2));
    };
    ziggurat.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            if (this.currentSouls < this.targetSouls) {
                this.secondsSinceLastSoul += ((timestamp - this.lastUpdate) / 1000);
            }
        }
        while (this.currentSouls < this.targetSouls && this.secondsSinceLastSoul > (1 / this.getSoulsPerSecond())) {
            var soulsTransformed = this.resources.soulWindToBody(1);
            if (soulsTransformed > 0) {
                this.secondsSinceLastSoul -= (1 / this.getSoulsPerSecond());
                this.currentSouls += 1;
            }
            else {
                break;
            }
        }
        this.lastUpdate = timestamp;
    };
    ziggurat.prototype.getDeleteSouls = function () {
        return this.getMostRecentBones() + this.currentSouls;
    };
    ziggurat.prototype.getSoulsRequired = function () {
        return this.targetSouls;
    };
    ziggurat.prototype.getSoulsConsumed = function () {
        return this.currentSouls;
    };
    ziggurat.prototype.getAnguishRequired = function () {
        return this.anguishRequired;
    };
    ziggurat.prototype.getDescription = function () {
        return this.description;
    };
    ziggurat.prototype.getCostForXBuilt = function (x) {
        return 5000;
    };
    ziggurat.prototype.end = function () {
        if (this.resources.spendPain(this.anguishRequired) || satanMode) {
            endFunction();
        }
        else {
            var flavour = document.getElementById("flavour");
            if (flavour != null) {
                flavour.innerHTML = "Not enough Anguish to perform the ritual.";
            }
        }
    };
    return ziggurat;
}(building));
var node = /** @class */ (function () {
    function node(x, y) {
        this.neighbours = [];
        this.x = x;
        this.y = y;
    }
    node.prototype.getNeighbours = function () {
        return this.neighbours;
    };
    node.prototype.clearNeighbours = function () {
        this.neighbours = [];
        //console.log("Neighbours cleared. " + this.neighbours.length);
    };
    node.prototype.addNeighbour = function (neighbour) {
        this.neighbours.push(neighbour);
    };
    node.prototype.removeNeighbour = function (neighbour) {
        //console.log("Neighbours before delete: " + this.neighbours.length);
        var index = -1;
        for (var i = 0; this.neighbours.length; i++) {
            if (this.neighbours[i] == neighbour) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.neighbours.splice(index, 1);
        }
        //console.log("Neighbours before delete: " + this.neighbours.length);
    };
    node.prototype.distanceFrom = function (neighbour) {
        return Math.sqrt((this.x - neighbour.x) ^ 2 + (this.y - neighbour.y) ^ 2);
    };
    node.prototype.getX = function () {
        return this.x;
    };
    node.prototype.getY = function () {
        return this.y;
    };
    node.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    return node;
}());
var path = /** @class */ (function () {
    function path(nodes) {
        this.waypoints = [];
        for (var i = 0; i < nodes.length; i++) {
            var wp = new waypoint();
            wp.x = nodes[i].getX();
            wp.y = nodes[i].getY();
            this.waypoints.push(wp);
        }
    }
    path.prototype.getLength = function () {
        return this.waypoints.length;
    };
    path.prototype.trimEnd = function () {
        this.waypoints.splice(-1, 1);
    };
    path.prototype.duplicateStart = function () {
        this.waypoints.splice(0, 0, this.duplicateWayPoint(this.waypoints[0]));
    };
    path.prototype.duplicateEnd = function () {
        this.waypoints.splice(this.waypoints.length, 0, this.duplicateWayPoint(this.waypoints[this.waypoints.length - 1]));
    };
    path.prototype.duplicateWayPoint = function (input) {
        var output = new waypoint();
        output.x = input.x;
        output.y = input.y;
        return output;
    };
    path.prototype.reachNextWayPoint = function () {
        this.waypoints.splice(0, 1);
    };
    path.prototype.getCurrentWayPoint = function () {
        return this.waypoints[0];
    };
    path.prototype.getNextWayPoint = function () {
        if (this.waypoints.length < 2) {
            return null;
        }
        return this.waypoints[1];
    };
    path.prototype.toString = function () {
        var output = "Path -  ";
        for (var i = 0; i < this.waypoints.length; i++) {
            output = output + this.waypoints[i].x + "," + this.waypoints[i].y + " ";
        }
        return output;
    };
    return path;
}());
var pathFollower = /** @class */ (function () {
    function pathFollower() {
        this.progressToNextWayPoint = 0;
        //Currently this is "percent per second to next waypoint"
        //Will need to refactor for waypoints of different distances
        this.speed = 1.3;
        this.finished = false;
    }
    pathFollower.prototype.setPath = function (path) {
        this.path = path;
        //console.log(this.path.toString());
    };
    pathFollower.prototype.isTravelling = function () {
        if (this.path != null) {
            return true;
        }
        else {
            return false;
        }
    };
    pathFollower.prototype.getNextWayPoint = function () {
        return this.path.getNextWayPoint();
    };
    pathFollower.prototype.getX = function () {
        if (this.path == null) {
            return null;
        }
        var currentWayPoint = this.path.getCurrentWayPoint();
        var nextWayPoint = this.path.getNextWayPoint();
        if (nextWayPoint == null) {
            return currentWayPoint.x;
        }
        return ((nextWayPoint.x - currentWayPoint.x) * this.progressToNextWayPoint) + currentWayPoint.x;
    };
    pathFollower.prototype.getY = function () {
        if (this.path == null) {
            return null;
        }
        var currentWayPoint = this.path.getCurrentWayPoint();
        var nextWayPoint = this.path.getNextWayPoint();
        if (nextWayPoint == null) {
            return currentWayPoint.y;
        }
        return ((nextWayPoint.y - currentWayPoint.y) * this.progressToNextWayPoint) + currentWayPoint.y;
    };
    pathFollower.prototype.isFinished = function () {
        return this.finished;
    };
    pathFollower.prototype.update = function (timestamp) {
        if (this.lastUpdate != null) {
            if (this.path != null) {
                var progress = ((timestamp - this.lastUpdate) / 1000) * this.speed;
                this.progressToNextWayPoint += progress;
                if (this.progressToNextWayPoint >= 1) {
                    this.progressToNextWayPoint -= 1;
                    this.path.reachNextWayPoint();
                }
            }
            if (this.path.getNextWayPoint() == null) {
                //Reached destination
                this.finished = true;
                this.path = null;
                this.progressToNextWayPoint = 0;
            }
        }
        this.lastUpdate = timestamp;
    };
    return pathFollower;
}());
var pathfinder = /** @class */ (function () {
    function pathfinder() {
    }
    pathfinder.prototype.findPath = function (start, end) {
        if (start == end) {
            return null;
        }
        var closed = [];
        var open = [];
        var prevs = [];
        open.push(start);
        while (open.length > 0) {
            //Current node we are checking is first node in open
            var current = open[0];
            open.splice(0, 1);
            if (current == end) { //Found finish
                return this.buildPath(end, prevs);
            }
            var neighbours = current.getNeighbours();
            for (var i = 0; i < neighbours.length; i++) {
                var neighbour = neighbours[i];
                //New neighbour not in closed or open set
                //Works because breadth first search, and assumes cost between nodes is equal
                if (closed.indexOf(neighbour) == -1 && open.indexOf(neighbour) == -1) {
                    open.push(neighbour);
                    prevs[neighbour.toString()] = current;
                }
            }
            //We have finished checking current node
            closed.push(current);
            //console.log("Open: " + open);
            //console.log("Closed: " + closed);
        }
        return null;
    };
    pathfinder.prototype.buildPath = function (end, prevs) {
        var nodesPath = [];
        var currentNode = end;
        nodesPath.unshift(end);
        while (prevs[currentNode.toString()] != null) {
            nodesPath.unshift(prevs[currentNode.toString()]);
            currentNode = prevs[currentNode.toString()];
        }
        return new path(nodesPath);
    };
    pathfinder.prototype.findPathBetweenBuildings = function (start, end, hellPathGraph) {
        var startX = start.getX();
        var startY = start.getY();
        var endX = end.getX();
        var endY = end.getY();
        //Temporarily add buildings to node graph
        hellPathGraph.addNode(startX, startY);
        hellPathGraph.addNode(endX, endY);
        var path = this.findPathFromCoords(startX, startY, endX, endY, hellPathGraph);
        if (path != null) {
            path.reachNextWayPoint();
            path.trimEnd();
            path.duplicateStart();
            path.duplicateEnd();
        }
        //Remove temporary buildings
        hellPathGraph.removeNode(startX, startY);
        hellPathGraph.removeNode(endX, endY);
        return path;
    };
    pathfinder.prototype.findPathFromCoords = function (startX, startY, endX, endY, hellPathGraph) {
        var startNode = hellPathGraph.getNode(startX, startY);
        var endNode = hellPathGraph.getNode(endX, endY);
        if (startNode == null || endNode == null) {
            return null;
        }
        else {
            return this.findPath(startNode, endNode);
        }
    };
    return pathfinder;
}());
var waypoint = /** @class */ (function () {
    function waypoint() {
    }
    return waypoint;
}());
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
var BackgroundRenderer = /** @class */ (function () {
    /**
    
            To render tiles of different colours a new tile renderer must be constructed.
            
            This is to encourage designers to batch tiles by colour, which will increase performances.
            
            Be careful not to use an old tileRenderer if a new one has been constructed.
    
    */
    function BackgroundRenderer(canvasContext, tileWidth, fontSize, colour) {
        this.canvasContext = null;
        this.canvasContext = canvasContext;
        this.tileWidth = tileWidth;
        this.fontSize = fontSize;
        this.canvasContext.fillStyle = colour;
    }
    BackgroundRenderer.prototype.renderBackground = function (x, y) {
        this.canvasContext.fillRect(x * this.tileWidth, y * this.fontSize, this.tileWidth, this.fontSize);
    };
    return BackgroundRenderer;
}());
var CharacterRenderer = /** @class */ (function () {
    /**

            To render tiles of different colours a new tile renderer must be constructed.
            
            This is to encourage designers to batch tiles by colour, which will increase performances.
            
            Be careful not to use an old tileRenderer if a new one has been constructed.

    */
    function CharacterRenderer(canvasContext, tileWidth, fontSize, font, colour, shadow) {
        this.canvasContext = null;
        this.font = null;
        this.colour = null;
        this.shadow = null;
        this.characterImageDictionary = {};
        this.canvasContext = canvasContext;
        this.tileWidth = tileWidth;
        this.fontSize = fontSize;
        this.font = fontSize.toString() + "px " + font;
        this.colour = colour;
        this.shadow = shadow;
    }
    CharacterRenderer.prototype.renderCharacter = function (character, x, y) {
        var characterCanvas;
        if (this.characterImageDictionary[character] == null) {
            characterCanvas = document.createElement("canvas");
            this.characterImageDictionary[character] = characterCanvas;
            characterCanvas.height = this.fontSize;
            characterCanvas.width = this.tileWidth;
            var characterContext = characterCanvas.getContext("2d");
            characterContext.textBaseline = "middle";
            characterContext.textAlign = "center";
            characterContext.font = this.font;
            characterContext.fillStyle = this.colour;
            if (this.shadow != null) {
                characterContext.shadowColor = this.shadow;
                characterContext.shadowBlur = 5;
            }
            else {
                characterContext.shadowColor = "rgba(0,0,0,0)";
                characterContext.shadowBlur = 0;
            }
            characterContext.fillText(character, 0.5 * this.tileWidth, 0.5 * this.fontSize);
        }
        else {
            characterCanvas = this.characterImageDictionary[character];
        }
        this.canvasContext.drawImage(characterCanvas, x * this.tileWidth, y * this.fontSize);
    };
    return CharacterRenderer;
}());
var Tile = /** @class */ (function () {
    function Tile() {
    }
    Tile.prototype.changed = function (other) {
        if (this.character != other.character ||
            this.colour != other.colour ||
            this.background != other.background ||
            this.shadow != other.shadow) {
            return true;
        }
        return false;
    };
    return Tile;
}());
var TilemapRenderer = /** @class */ (function () {
    function TilemapRenderer(width, height, font, fontSize, tileWidth) {
        this.tileMap = [];
        this.tileMapNext = [];
        this.tileChanged = [];
        this.canvas = null;
        this.context = null;
        this.offCanvas = null;
        this.offContext = null;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fontSize = fontSize;
        this.tileWidth = tileWidth;
        for (var x = 0; x < this.width; x++) {
            var yArray = [];
            yArray.length = this.height;
            this.tileMap.push(yArray);
            var yArray2 = [];
            yArray2.length = this.height;
            this.tileMapNext.push(yArray2);
            var yArray3 = [];
            yArray3.length = this.height;
            this.tileChanged.push(yArray3);
        }
    }
    TilemapRenderer.prototype.setAllNextTilesBlank = function () {
        this.tileMapNext = [];
        for (var x = 0; x < this.width; x++) {
            var yArray = [];
            for (var y = 0; y < this.height; y++) {
                var newBlankTile = new Tile();
                newBlankTile.colour = 'black';
                newBlankTile.background = 'white';
                newBlankTile.character = ' ';
                yArray.push(newBlankTile);
            }
            this.tileMapNext.push(yArray);
        }
    };
    TilemapRenderer.prototype.fillNullTiles = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.tileMap[x][y] == null) {
                    var newBlankTile = new Tile();
                    newBlankTile.colour = 'black';
                    newBlankTile.background = 'white';
                    newBlankTile.character = ' ';
                    this.tileMap[x][y] = newBlankTile;
                }
            }
        }
    };
    TilemapRenderer.prototype.setAllTilesChanged = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.tileChanged[x][y] = true;
            }
        }
    };
    TilemapRenderer.prototype.copyCurrentMapToNext = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.tileMapNext[x][y] = this.tileMap[x][y];
            }
        }
    };
    TilemapRenderer.prototype.getCanvas = function () {
        return this.canvas;
    };
    TilemapRenderer.prototype.createCanvas = function () {
        //Create Offscreen canvas
        this.offCanvas = document.createElement("canvas");
        this.offContext = this.offCanvas.getContext("2d");
        this.offCanvas.height = this.height * this.fontSize;
        this.offCanvas.width = this.width * this.tileWidth;
        // Create the canvas
        this.canvas = document.createElement("canvas");
        if (!this.canvas.getContext)
            throw ("Canvas not supported");
        this.context = this.canvas.getContext("2d");
        this.canvas.height = this.offCanvas.height;
        this.canvas.width = this.offCanvas.width;
        this.forceRenderAll();
        return this.canvas;
    };
    TilemapRenderer.prototype.renderTile = function (x, y, character, colour, background, shadow) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return;
        }
        var tile = new Tile();
        tile.character = character;
        tile.colour = colour;
        tile.background = background;
        tile.shadow = shadow;
        this.tileMapNext[x][y] = tile;
    };
    TilemapRenderer.prototype.forceRenderAll = function () {
        this.fillNullTiles();
        this.copyCurrentMapToNext();
        this.setAllTilesChanged();
        this.renderChangedTiles();
        this.copyToScreenCanvas();
    };
    TilemapRenderer.prototype.finishRendering = function () {
        this.calculateTilesChanged();
        this.renderChangedTiles();
        this.copyToScreenCanvas();
    };
    TilemapRenderer.prototype.calculateTilesChanged = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var tile = this.tileMap[x][y];
                var tileNext = this.tileMapNext[x][y];
                if (tile == null && tileNext == null) {
                    this.tileChanged[x][y] = false;
                }
                else if ((tile != null && tileNext == null) || (tile == null && tileNext != null)) {
                    this.tileChanged[x][y] = true;
                }
                else {
                    this.tileChanged[x][y] = tile.changed(tileNext);
                }
            }
        }
    };
    TilemapRenderer.prototype.renderChangedTiles = function () {
        var backgroundDictionary = {};
        var characterDictionary = {};
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.tileChanged[x][y]) {
                    var tile = this.tileMapNext[x][y];
                    this.tileMap[x][y] = tile;
                    if (backgroundDictionary[tile.background] == null) {
                        backgroundDictionary[tile.background] = [];
                    }
                    backgroundDictionary[tile.background].push([x, y]);
                    var characterIndex = tile.colour + "," + tile.shadow;
                    if (characterDictionary[characterIndex] == null) {
                        characterDictionary[characterIndex] = [];
                    }
                    characterDictionary[characterIndex].push([x, y]);
                }
            }
        }
        var backgroundKeys = Object.keys(backgroundDictionary);
        for (var i = 0; i < backgroundKeys.length; i++) {
            var backgroundRenderer = new BackgroundRenderer(this.offContext, this.tileWidth, this.fontSize, backgroundKeys[i]);
            for (var j = 0; j < backgroundDictionary[backgroundKeys[i]].length; j++) {
                var tileX = backgroundDictionary[backgroundKeys[i]][j][0];
                var tileY = backgroundDictionary[backgroundKeys[i]][j][1];
                backgroundRenderer.renderBackground(tileX, tileY);
            }
        }
        var characterKeys = Object.keys(characterDictionary);
        for (var i = 0; i < characterKeys.length; i++) {
            var colourShadow = characterKeys[i].split(",");
            var colour = colourShadow[0];
            var shadow = null;
            if (colourShadow[1] != "null" && colourShadow[1] != "undefined") {
                shadow = colourShadow[1];
            }
            var characterRenderer = new CharacterRenderer(this.offContext, this.tileWidth, this.fontSize, this.font, colour, shadow);
            for (var j = 0; j < characterDictionary[characterKeys[i]].length; j++) {
                var tileX = characterDictionary[characterKeys[i]][j][0];
                var tileY = characterDictionary[characterKeys[i]][j][1];
                characterRenderer.renderCharacter(this.tileMapNext[tileX][tileY].character, tileX, tileY);
            }
        }
    };
    TilemapRenderer.prototype.copyToScreenCanvas = function () {
        this.context.drawImage(this.offCanvas, 0, 0);
    };
    return TilemapRenderer;
}());
var TransientRenderer = /** @class */ (function () {
    function TransientRenderer(width, height, font, fontSize, tileWidth) {
        this.tiles = [];
        this.canvas = null;
        this.context = null;
        this.offCanvas = null;
        this.offContext = null;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fontSize = fontSize;
        this.tileWidth = tileWidth;
    }
    TransientRenderer.prototype.getCanvas = function () {
        return this.canvas;
    };
    TransientRenderer.prototype.createCanvas = function () {
        //Create Offscreen canvas
        this.offCanvas = document.createElement("canvas");
        this.offContext = this.offCanvas.getContext("2d");
        this.offCanvas.height = this.height * this.fontSize;
        this.offCanvas.width = this.width * this.tileWidth;
        // Create the canvas
        this.canvas = document.createElement("canvas");
        if (!this.canvas.getContext)
            throw ("Canvas not supported");
        this.context = this.canvas.getContext("2d");
        this.canvas.height = this.offCanvas.height;
        this.canvas.width = this.offCanvas.width;
        return this.canvas;
    };
    TransientRenderer.prototype.renderTile = function (x, y, character, colour, background, shadow) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return;
        }
        var tile = new Tile();
        tile.character = character;
        tile.colour = colour;
        tile.background = background;
        tile.shadow = shadow;
        this.tiles.push([x, y, tile]);
    };
    TransientRenderer.prototype.finishRendering = function () {
        var characterDictionary = {};
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i][2];
            var characterIndex = tile.colour + "," + tile.shadow;
            if (characterDictionary[characterIndex] == null) {
                characterDictionary[characterIndex] = [];
            }
            characterDictionary[characterIndex].push([this.tiles[i][0], this.tiles[i][1], i]);
        }
        var characterKeys = Object.keys(characterDictionary);
        for (var i = 0; i < characterKeys.length; i++) {
            var colourShadow = characterKeys[i].split(",");
            var colour = colourShadow[0];
            var shadow = null;
            var characterRenderer = new CharacterRenderer(this.offContext, this.tileWidth, this.fontSize, this.font, colour, shadow);
            for (var j = 0; j < characterDictionary[characterKeys[i]].length; j++) {
                var tileX = characterDictionary[characterKeys[i]][j][0];
                var tileY = characterDictionary[characterKeys[i]][j][1];
                var tileIndex = characterDictionary[characterKeys[i]][j][2];
                characterRenderer.renderCharacter(this.tiles[tileIndex][2].character, tileX, tileY);
            }
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.offCanvas, 0, 0);
        this.offContext.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);
        this.tiles = [];
    };
    return TransientRenderer;
}());
