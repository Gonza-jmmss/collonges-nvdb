import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default function DeleteModal({
  openModal,
  closeModal,
  titleText,
  descriptionText,
  deletefunction,
  disable,
  isPending,
}: {
  openModal: boolean;
  closeModal: () => void;
  titleText: string;
  descriptionText: string;
  deletefunction: () => void;
  disable?: boolean;
  isPending?: boolean;
}) {
  const t = frFR;

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div>
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="text-lg font-semibold">{`${titleText}`}</div>
          <div>{`${descriptionText}`}</div>
        </div>
        <div className="mt-5 flex w-full justify-center space-x-5">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[30%]"
            onClick={closeModal}
          >
            {t.shared.cancel}
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            className="w-[30%]"
            onClick={deletefunction}
            disabled={isPending}
          >
            {disable ? t.shared.disable : t.shared.delete}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
