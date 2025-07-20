import express, { Router } from 'express';
import Document from '../Models/Document';

const DocumentRouter: Router = express.Router();

DocumentRouter.post('/post-document', async (req, res) => {
  const { title, content } = req.body;

  try {
    const payload = new Document({
      title,
      content,
    });

    const savedDoc = await payload.save();

    return res.status(201).send({ msg: 'Document saved successfully', id: savedDoc._id });
  } catch (err: any) {
    return res.status(500).send({ msg: `Failed to save document: ${err.message}` });
  }
});
DocumentRouter.get('/doc/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Document.findById(id);
    if (response) {
      const body = response.content;
      return res.status(200).send({ content: body, msg: "Document fetched" });
    } else {
      return res.status(404).send({ msg: "Document not found" });
    }
  } catch (err: any) {
    return res.status(500).send({ msg: `Internal Error: ${err.message}` });
  }
});

export default DocumentRouter;
