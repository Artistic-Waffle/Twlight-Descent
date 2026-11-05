import { world, system } from "@minecraft/server";

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

    const player = event.player;
    const block = event.block;
    const blockLocation = block.location; 

    const isChair = block.hasTag("td:chair");

        if (!isChair) return;

    const isLargeChair = block.hasTag("td:large_chair");

    const seatType = isLargeChair ? "td:chair_sit_large" : "td:chair_sit";



     if (!event.isFirstEvent) return;


    const seatLocation = {
        x: blockLocation.x + 0.5,
        y: blockLocation.y,
        z: blockLocation.z + 0.5
    }

    const facing = block.permutation.getState("minecraft:cardinal_direction");
    const rotation = facing === "north" ? 180 : facing === "east" ? -90 : facing === "south" ? 0 : 90;
   
    

    

    system.run(() => {


         const existingSeats = player.dimension.getEntities({
            type: seatType,
            location: seatLocation,
            maxDistance: 0.3
        });

        let seat;

        if (existingSeats.length > 0) {
            seat = existingSeats[0];
        } else {
            seat = player.dimension.spawnEntity(seatType, seatLocation);
        }
        const rideable = seat.getComponent("minecraft:rideable");
        const riderCount = rideable.getRiders().length;

        if (riderCount > 0) {
            player.sendMessage("This chair is occupied!");
            return;
        }
        
         const angle = rotation;

            seat.setRotation({
                x: 0,
                y: angle,
            })

        const success = rideable.addRider(player);
       
       /* debug messages for seating process 
          if (success) {
            player.sendMessage("Player successfully seated!");
        } else {
            player.sendMessage("Player could not sit!");
        }
        
       

        player.sendMessage(`Nearby seats: ${existingSeats.length}`);
        player.sendMessage(`Seat type: ${seatType}`);
        */
        
    });

});