import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { onError } from "../../libs/errorLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import {s3Upload} from "../../libs/awsLib";
import config from "../../config";

export default function Notes() {
  const file = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (error) {
        onError(error);
      }
    }

    onLoad();
  }, [id]);

  function loadNote() {
    return API.get("notes", `/notes/${id}`);
  }

  function saveNote(note) {
    // We save the note by making a PUT request with the note object to /notes/:id where we get the id from the useParams hook. We use the API.put() method from AWS Amplify.
    // TODO: You might have noticed that we are not deleting the old attachment when we upload a new one.
    return API.put("notes", `/notes/${id}`, {
      body: note
    })
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
    console.log("files: ", event.target.files);
  }

  async function handleSubmit(event) {
    let attachment;
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      // If there is a file to upload we call s3Upload to upload it and save the key we get from S3. If there isn’t then we simply save the existing attachment object, note.attachment.
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment
      });

      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault(event);

    // TODO: delete the attachment when we are deleting a note https://aws.github.io/aws-amplify/api/classes/storageclass.html#remove

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    // TODO: you might have noticed that we are not deleting the attachment when we are deleting a note.
    try {
      await deleteNote();
      history.push('/');
    } catch (error) {
      onError(error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="title">
            <FormControl
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={event => setContent(event.target.value)}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
