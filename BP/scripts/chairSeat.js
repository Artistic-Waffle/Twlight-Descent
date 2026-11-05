import { world } from "@minecraft/server";

world.afterEvents.playerInteractWithBlock.subscribe((event) => {

    const player = event.player;
    const block = event.block;
    const blockLocation = block.location;

    const seatLocation = {
        x: blockLocation.x + 0.5,
        y: blockLocation.y,
        z: blockLocation.z + 0.5
    }

    if (block.typeId !== "td:oak_chair") return;

    player.sendMessage(`Seat location: x=${seatLocation.x}, y=${seatLocation.y}, z=${seatLocation.z}`);



});