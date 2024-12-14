/*:
 * @plugindesc ระบบเสียงเดินและวิ่ง (Footstep Sound) สำหรับ RPG Maker MV/MZ
 * @author YourName
 *
 * @help
 * ใส่เสียง Footsteps_02 และ Footsteps_03 ในโฟลเดอร์ audio/se
 * เสียงจะเล่นสลับกันตามการเดินและวิ่งของผู้เล่น
 * 
 * วิธีใช้งาน:
 * - เปิด Plugin Manager และเปิดใช้งาน Plugin นี้
 * - ไม่ต้องเพิ่ม Common Event
 */

(() => {
    // ตัวแปรสำหรับควบคุมเสียง
    const footstepControl = {
        currentStep: 1, // ลำดับเสียงที่เล่น (1 หรือ 2)
        isPlaying: false, // สถานะการเล่นเสียง
    };

    // กำหนดอัตราความถี่เสียงสำหรับเดินและวิ่ง
    const WALK_WAIT = 30; // เวลารอสำหรับเดิน (เฟรม)
    const DASH_WAIT = 15; // เวลารอสำหรับวิ่ง (เฟรม)

    // ฟังก์ชันตรวจสอบการเคลื่อนไหวและเรียกเสียง
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);

        // ตรวจสอบว่าผู้เล่นกำลังเดินหรือวิ่ง
        if (this.isMoving() && !footstepControl.isPlaying) {
            this.playFootstepSound(); // เรียกเสียงเดิน/วิ่ง
        }
    };

    // ฟังก์ชันเล่นเสียงเดิน/วิ่ง
    Game_Player.prototype.playFootstepSound = function() {
        // กำหนดเสียงและค่าพารามิเตอร์
        const isDashing = this.isDashing();
        const soundName = footstepControl.currentStep === 1 ? "Footsteps_02" : "Footsteps_03";
        const footstepPitch = isDashing ? 110 : 100;
        const waitTime = isDashing ? DASH_WAIT : WALK_WAIT;

        // เล่นเสียง
        AudioManager.playSe({
            name: soundName,
            volume: 20,
            pitch: footstepPitch,
            pan: 0,
        });

        // สลับเสียง (Footsteps_02 กับ Footsteps_03)
        footstepControl.currentStep = footstepControl.currentStep === 1 ? 2 : 1;

        // ล็อกสถานะการเล่นเสียง
        footstepControl.isPlaying = true;

        // ตั้งค่าให้รอเวลาระหว่างเสียง
        setTimeout(() => {
            footstepControl.isPlaying = false; // ปลดล็อกสถานะหลังรอครบเวลา
        }, waitTime * 16.67); // แปลงเฟรมเป็นมิลลิวินาที (1 เฟรม ≈ 16.67 ms)
    };
})();